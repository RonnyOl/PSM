import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import jwt from 'jsonwebtoken';

export default async function ChatLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    console.log('❌ No hay token');
    redirect('/login');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY!);
    console.log('✅ Token verificado:', decoded);
  } catch {
    console.log('❌ Token inválido');
    redirect('/login');
  }

  return <>{children}</>;
}
