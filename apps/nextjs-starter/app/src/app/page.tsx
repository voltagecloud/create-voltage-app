export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-12 gap-12">
      <div className="flex gap-4 p-4 rounded border border-gray-500 max-w-7xl">
        <span className="font-semibold">Admin Macaroon:</span>
        <div className="break-all">
          {process.env.NEXT_PUBLIC_ADMIN_MACAROON}
        </div>
      </div>

      <div className="flex gap-4 p-4 rounded border border-gray-500 max-w-7xl">
        <span className="font-semibold">API Endpoint:</span>
        <div className="break-all">{process.env.NEXT_PUBLIC_API_ENDPOINT}</div>
      </div>
    </main>
  );
}
