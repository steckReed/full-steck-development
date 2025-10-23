import { Montserrat } from "next/font/google";

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500', '600', '800'],
  display: 'swap',
  variable: '--font-montserrat',
});

export default montserrat;
