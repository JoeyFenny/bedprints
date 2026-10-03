import { pageMeta } from '../../lib/seo';
import PageShell from '../../components/PageShell';
import SizeTable from '../../components/SizeTable';
import Todo from '../../components/Todo';

export const metadata = pageMeta({ title: 'Size guide', description: 'Mattress, duvet and pillow sizes for BedPrince sheet sets, duvet covers, comforters and pillows.', path: '/size-guide/' });

export default function SizeGuide() {
  return (
    <PageShell title="Size guide" kicker="Help" intro="Pick the size that matches your mattress, duvet or pillow." path="/size-guide/">
      <div className="prose">
        <h2>Sheets</h2>
        <p>Choose the size that matches your mattress. Our sheet set fits mattresses up to 16 inches deep.</p>
        <SizeTable kind="mattress" />
        <p>Finished product dimensions (fitted sheet, flat sheet, pillowcases): <Todo>confirm product dimensions</Todo></p>
        <h2>Duvet covers and comforters</h2>
        <p>Choose the size that matches your duvet insert or bed.</p>
        <SizeTable kind="duvet" />
        <p>Finished cover and comforter dimensions: <Todo>confirm product dimensions</Todo></p>
        <h2>Pillows and pillowcases</h2>
        <SizeTable kind="pillow" />
        <h2>Throw blanket</h2>
        <p>One size: 50 x 60 inches.</p>
        <h2>Not sure?</h2>
        <p>Measure your mattress length, width and depth, then compare with the tables above. If you are between sizes, contact us and we will help.</p>
      </div>
    </PageShell>
  );
}
