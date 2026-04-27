export async function GET() {
  const res = await fetch(
    "https://api.frankfurter.app/latest?from=USD&to=MXN"
  );

  const data = await res.json();

  return new Response(
    JSON.stringify({
      mxn: data.rates.MXN
    }),
    {
      headers: {
        "Content-Type": "application/json"
      }
    }
  );
}