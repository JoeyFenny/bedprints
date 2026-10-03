import { pageMeta, faqLd } from '../../lib/seo';
import PageShell from '../../components/PageShell';
import FaqList from '../../components/FaqList';
import JsonLd from '../../components/JsonLd';
import { faqs } from '../../lib/content';

export const metadata = pageMeta({ title: 'FAQ', description: 'Answers about bamboo bedding, sizing, care, shipping, the 30-night sleep trial and checkout.', path: '/faq/' });

export default function Faq() {
  return (
    <PageShell title="Frequently asked questions" kicker="Help" intro="Quick answers about our bedding, shipping and the sleep trial." path="/faq/">
      <div className="prose"><FaqList items={faqs} /></div>
      <JsonLd data={faqLd(faqs)} />
    </PageShell>
  );
}
