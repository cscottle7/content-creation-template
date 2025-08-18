Console Error

A tree hydrated but some attributes of the server rendered HTML didn't match the client properties. This won't be patched up. This can happen if a SSR-ed Client Component used:

- A server/client branch `if (typeof window !== 'undefined')`.
- Variable input such as `Date.now()` or `Math.random()` which changes each time it's called.
- Date formatting in a user's locale which doesn't match the server.
- External changing data without sending a snapshot of it along with the HTML.
- Invalid HTML tag nesting.

It can also happen if the client has a browser extension installed which messes with the HTML before React loaded.

See more info here: https://nextjs.org/docs/messages/react-hydration-error


  ...
    <Router actionQueue={{state:{...}, ...}} assetPrefix="" globalError={[...]} gracefullyDegrade={false}>
      <HistoryUpdater>
      <RuntimeStyles>
      <HotReload assetPrefix="" globalError={[...]}>
        <AppDevOverlayErrorBoundary globalError={[...]}>
          <ReplaySsrOnlyErrors>
          <DevRootHTTPAccessFallbackBoundary>
            <HTTPAccessFallbackBoundary notFound={<NotAllowedRootHTTPFallbackError>}>
              <HTTPAccessFallbackErrorBoundary pathname="/" notFound={<NotAllowedRootHTTPFallbackError>} ...>
                <RedirectBoundary>
                  <RedirectErrorBoundary router={{...}}>
                    <Head>
                    <link>
                    <RootLayout>
                      <html
                        lang="en"
-                       data-arp=""
                      >
                    ...
src\app\layout.tsx (16:5) @ RootLayout


  14 | }) {
  15 |   return (
> 16 |     <html lang="en">
     |     ^
  17 |       <body>{children}</body>
  18 |     </html>
  19 |   )
Call Stack
18

Show 16 ignore-listed frame(s)
html
<anonymous>
RootLayout
src\app\layout.tsx (16:5)