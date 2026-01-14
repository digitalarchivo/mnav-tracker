// app/layout.js
export const metadata = {
  title: 'Strategy Token mNAV Tracker',
  description: 'Live NFT strategy and BTC treasury mNAV tracker',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head />
      <body>{children}</body>
    </html>
  );
}
