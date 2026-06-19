import ClientHome from "../clients/layout";
import { generateMetadata } from "../helpers";

export const metadata = generateMetadata({
  title: 'Streamline Management Demo',
  description: 'View key usage metrics and analytics for your streamline management.',
  keywords: ['stream', 'stream line', 'management'],
});

export default function Home() {
  return <div>
    <ClientHome/>
    </div>;
}