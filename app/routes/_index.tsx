import { Form, useActionData, useNavigation } from '@remix-run/react';
import { json, ActionFunction } from '@remix-run/node';
import { saveEmail, generateDownloadToken } from '~/utils/server.utils';
import { useEffect, useState } from 'react';

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
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (email === '') {
    return json<ActionData>({
      error: `You didn't write anything`,
    });
  } else if (typeof email !== 'string' || !emailRegex.test(email)) {
    return json<ActionData>({
      error: `We both know that's not a real email address`,
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
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | undefined>(actionData?.error);

  useEffect(() => {
    setError(actionData?.error);
  }, [actionData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (error) setError('');
  };

  return (
    <>
      <div className="md:text-balance">
        <h1 className="font-normal text-2xl">AIPHABET</h1>
        <p className="w-full lg:w-4/5 ">
          Sharon Zheng is an artist who works across the digital and physical
          spaces, using tech to create art.
        </p>

        <p className="w-full lg:w-4/5 mb-8">
          Aiphabet is a free, printable zine inspired by the idea that
          &#34;alphabet&#34; looks like it starts with the letters &#34;AI&#34;.
          This project was created using Stable Diffusion and its understanding
          of the English alphabet as hand gestures.
        </p>
      </div>
      {actionData?.success && actionData?.downloadToken ? (
        <a
          href={`/download-pdf/${actionData.downloadToken}`}
          className="no-underline"
        >
          Click here to download AIPHABET Files
        </a>
      ) : (
        <>
          <Form method="post">
            <div className="w-full sm:flex sm:gap-4 sm:flex-row sm:justify-between md:w-4/5 xl:w-1/2 relative">
              <input
                name="email"
                value={email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                className="outline-none mb-1 px-0 sm:mb-0 flex-grow w-full sm:w-auto rounded-none"
              />
              <button
                type="submit"
                disabled={navigation.state === 'submitting'}
                className="p-0 text-black font-normal bg-white outline-none border-none cursor-pointer"
              >
                {navigation.state === 'submitting' ? 'Submitting...' : 'Submit'}
              </button>
            </div>
            {error && (
              <span className="text-[#FF0000] absolute mt-2 left-8 right-8">
                {error}
              </span>
            )}
          </Form>
        </>
      )}
      <img
        src="/xx.png"
        alt="Aiphabet"
        className="hidden sm:block absolute bottom-0 right-4 w-1/3"
      />
    </>
  );
}
