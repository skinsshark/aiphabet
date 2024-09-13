import { LoaderFunction } from '@remix-run/node';
import { verifyDownloadToken } from '~/utils/server.utils';

export const loader: LoaderFunction = async ({ params }): Promise<Response> => {
  const { token } = params;

  if (!token || !(await verifyDownloadToken())) {
    return new Response('Unauthorized', { status: 401 });
  }

  const googleDriveDownloadUrl = process.env
    .GOOGLE_DRIVE_DOWNLOAD_URL as string;

  return new Response(null, {
    status: 302,
    headers: {
      Location: googleDriveDownloadUrl,
    },
  });
};
