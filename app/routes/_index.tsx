import { Form, useActionData, useNavigation } from '@remix-run/react';
import { json, ActionFunction } from '@remix-run/node';
import { saveEmail, generateDownloadToken } from '~/utils/server.utils';

type ActionData = {
  error?: string;
  success?: boolean;
  downloadToken?: string;
};

export const action: ActionFunction = async ({
  request,
}): Promise<Response> => {
  const formData = await request.formData();
  const email = formData.get('email');

  if (typeof email !== 'string' || !email.includes('@')) {
    return json<ActionData>({
      error: `Respectfully, that's not a real email address`,
    });
  }

  try {
    await saveEmail(email);
    const downloadToken = await generateDownloadToken();
    return json<ActionData>({ success: true, downloadToken });
  } catch (error) {
    return json<ActionData>({
      error: 'Hmmm something went wrong... refresh and try again?',
    });
  }
};

export default function Index() {
  const actionData = useActionData<ActionData>();
  const navigation = useNavigation();

  return (
    <>
      <h1>AIPHABET (2024)</h1>
      {actionData?.success && actionData?.downloadToken ? (
        <a href={`/download-pdf/${actionData.downloadToken}`}>
          Click to download AIPHABET Files
        </a>
      ) : (
        <>
          <Form method="post">
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              required
            />
            <button
              type="submit"
              disabled={navigation.state === 'submitting'}
              className="ml-1"
            >
              {navigation.state === 'submitting' ? 'Submitting...' : 'Submit'}
            </button>
          </Form>

          {actionData?.error && (
            <span className="text-red-500">{actionData.error}</span>
          )}
        </>
      )}
    </>
  );
}
