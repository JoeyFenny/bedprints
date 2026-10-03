import Breadcrumbs from './Breadcrumbs';
import JsonLd from './JsonLd';
import { breadcrumbLd } from '../lib/seo';

// Wrapper for static content pages: breadcrumbs, heading, JSON-LD.
export default function PageShell({ title, kicker, intro, path, children, wide = false }) {
  const trail = [{ name: 'Home', path: '/' }, { name: title, path }];
  return (
    <main>
      <div className="collection-head">
        <div className="container">
          <Breadcrumbs trail={trail} />
          {kicker ? <p className="kicker" style={{ marginTop: 18 }}>{kicker}</p> : null}
          <h1 className="h1">{title}</h1>
          {intro ? <p className="lede">{intro}</p> : null}
        </div>
      </div>
      <div className={`container page-body${wide ? '' : ' prose-wrap'}`}>{children}</div>
      <JsonLd data={breadcrumbLd(trail)} />
    </main>
  );
}
