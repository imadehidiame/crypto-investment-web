import {
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  useNavigate,
} from "react-router";
import type { Route } from "./+types/root";
import appStylesHref from "./app.css?url";
import { AuthMiddleware } from "auth-middleware";
import { useEffect, useState } from "react";
import { log } from "./lib/utils";
import { Button } from "./components/ui/button";


export function Layout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    import('gsap').then((gsap) => {
      import('gsap/ScrollTrigger').then((ScrollTrigger) => {
        gsap.default.registerPlugin(ScrollTrigger.default);
        ScrollTrigger.default.refresh();
      });
    });
  }, []);
  return (
    <html lang="en">
      <head>
  <meta charSet="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
  <title>CoinInvestDesk - Crypto Investment Insights</title>
  <meta name="description" content="Explore the latest crypto investment opportunities, market trends, and expert insights at CoinInvestDesk, your trusted source for cryptocurrency wealth building." />
  <meta name="keywords" content="crypto investment, cryptocurrency, CoinInvestDesk, blockchain, crypto market, invest in crypto" />
  <meta name="author" content="CoinInvestDesk Team" />

  
  {/*<link rel="icon" type="image/svg+xml" href="/icons/ico512.svg" sizes="512x512" />
  <link rel="icon" type="image/svg+xml" href="/icons/ico192.svg" sizes="192x192" />
  <link rel="icon" type="image/svg+xml" href="/icons/ico32.svg" sizes="32x32" />
  <link rel="icon" type="image/svg+xml" href="/icons/ico16.svg" sizes="16x16" />*/}
  <link rel="icon" type="image/png" href="/icons/icon500.png" sizes="any" />
  <link rel="apple-touch-icon" sizes="180x180" href="/icons/icon500.png" />
  <link rel="apple-touch-icon" sizes="192x192" href="/icons/icon500.png" />

  
  <meta property="og:title" content="CoinInvestDesk - Crypto Investment Insights" />
  <meta property="og:description" content="Discover expert crypto investment advice and market trends at CoinInvestDesk, your go-to platform for cryptocurrency wealth building." />
  <meta property="og:image" content="/icons/icon500.png" />
  <meta property="og:image:width" content="512" />
  <meta property="og:image:height" content="512" />
  <meta property="og:url" content="https://coininvestdesk.com" />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="CoinInvestDesk" />

  
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="CoinInvestDesk - Crypto Investment Insights" />
  <meta name="twitter:description" content="Explore crypto investment opportunities and trends with CoinInvestDesk, your trusted crypto resource." />
  <meta name="twitter:image" content="/icons/icon500.png" />
  <meta name="twitter:site" content="@CoinInvestDesk" />

  
  <link rel="stylesheet" href={appStylesHref} />
</head>
      <body className="bg-dark text-gold">
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App({  }:Route.ClientActionArgs) {
  return (
        <Outlet />
  );
}

export function HydrateFallback() {
  return (
    <div id="loading-splash">
      <div id="loading-splash-spinner" />
      <p>Loading, please wait...</p>
    </div>
  );
}

// The top most error boundary for the app, rendered when your app throws an error
// For more information, see https://reactrouter.com/start/framework/route-module#errorboundary
export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = 'Oops!';
  let details = 'An unexpected error occurred.';
  let stack: string | undefined;
  let code = 1000;
  let nav = useNavigate();
  const [is_connected,set_is_connected] = useState(false);
  useEffect(()=>{
    const internet = ()=>{
    if(navigator.onLine){
      set_is_connected(true);
      location.reload();
    }
    else
      set_is_connected(false);
    }
    //log(navigator.onLine,'Is browser online?');
    window.addEventListener('online',internet);
    window.addEventListener('offline',internet);
    return ()=>{
      window.removeEventListener('offline',internet);
      window.removeEventListener('online',internet);
    }
    //window.addEventListener('')
  },[])
  

  if (isRouteErrorResponse(error)) {
    //log('It is indeed a route error','Errot type');
    //log(error,'Error message');
    code = error.status;
    message = error.status === 404 ? '404' : 'Error';
    details =
      error.status === 404
        ? 'The requested page could not be found.'
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    if(error.message.toLocaleLowerCase().includes('mongo') && error.message.toLocaleLowerCase().includes('enotfound'))
    code = 500;
    
    //log('It is not a route error','Errot type');
    //log(error.message,'Error message');
    //log(import.meta.env.DEV,'Environment');
    //log(import.meta.env,'Environment values');
    details = error.message.toLocaleLowerCase().includes('mongo') && error.message.toLocaleLowerCase().includes('enotfound') ? "Please make sure your device is connected to the internet and reload the page" : error.message;
    //stack = error.stack;
    stack = '';
  }else{
    if(error instanceof Error)
    code = error.message.toLocaleLowerCase().includes('mongo') && error.message.toLocaleLowerCase().includes('enotfound') ? 500 : 1000;
    if(error instanceof Error)
    details = error.message.toLocaleLowerCase().includes('mongo') && error.message.toLocaleLowerCase().includes('enotfound') ? "Please make sure your device is connected to the internet and reload the page" : error.message;
  }

  return (
    <main id="error-page" className="min-h-screen flex items-center justify-center bg-dark">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gold mb-4">{message}</h1>
        <p className="text-white mb-4">{details}</p>
        {stack && (
          <pre className="text-white">
            <code>{stack}</code>
          </pre>
        )}
        {code === 404 && 
        <Button onClick={()=>{
          nav(-1);
          }} variant="outline" className="ml-auto border-gold-500 border-amber-300 text-amber-300 hover:border-amber-50 hover:text-amber-50 cursor-pointer">
             Go Back
        </Button>
        }
        {
          code === 500 && <Button onClick={()=>{
              location.reload();
            }} variant="outline" disabled={!is_connected} className="ml-auto border-gold-500 border-amber-300 text-amber-300 hover:border-amber-50 hover:text-amber-50 cursor-pointer">
               { is_connected ?' Reload Page' : 'Not connected'}
          </Button>
        }
      </div>
    </main>
  );
}

export const unstable_middleware = [AuthMiddleware]