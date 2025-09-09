export const metadata = {
  title: 'One Cart',
  description: '도매 선적 장바구니',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}

