// Marketing copy shared across pages. Claims are deliberately cautious: no certifications are claimed.

export const faqs = [
  { q: 'What is bamboo viscose?', a: 'Bamboo viscose (also called bamboo rayon) is a soft fabric made from plant cellulose that comes from bamboo. It is known for a smooth, silky hand-feel and good breathability. Our bedding is made from bamboo viscose; we do not claim any third-party certifications on this site.' },
  { q: 'Will it really sleep cooler than cotton?', a: 'Bamboo viscose is breathable and wicks moisture, and many people find it feels cool against the skin. Everyone sleeps differently, which is why every order comes with a 30-night sleep trial.' },
  { q: 'How does the 30-night sleep trial work?', a: 'Try your bedding at home for 30 nights. If it is not for you, contact us and we will help with a return. See the Shipping & Returns page for the current details.' },
  { q: 'Is shipping free?', a: 'US orders over $75 ship free. Under $75, shipping is calculated at checkout.' },
  { q: 'How do I wash bamboo bedding?', a: 'Our pieces are machine washable. A gentle cycle in cool water and low-heat drying is a good default; always follow the care label on your item. Bamboo viscose tends to feel softer after the first few washes.' },
  { q: 'Is bamboo bedding good for sensitive skin?', a: 'Many people with sensitive skin enjoy the smooth, gentle feel of bamboo viscose. We cannot make medical claims, so if you have a skin condition, check with your doctor.' },
  { q: 'What size should I order?', a: 'Choose the size that matches your mattress. Our sheet set fits mattresses up to 16 inches deep. The Size guide has mattress and duvet dimensions for every option.' },
  { q: 'Can I buy several products at once?', a: 'Yes, add them all to your bag. While we finish setting up multi-product checkout you may be asked to check out one product at a time; your bag keeps the rest while you do.' },
  { q: 'How do I pay?', a: 'Checkout is handled by Stripe on a secure hosted page. Your card details never touch this site.' },
  { q: 'How can I reach you?', a: 'See the Contact page. We aim to reply as quickly as we can.' },
];

export const benefits = [
  { icon: 'snow', title: 'Cool to the touch', text: 'Breathable bamboo viscose feels smooth and cool against the skin, which many hot sleepers appreciate.' },
  { icon: 'feather', title: 'Soft, and softer with washing', text: 'A silky, drapey hand-feel that tends to get softer with every wash.' },
  { icon: 'leaf', title: 'A plant-based fibre', text: 'Bamboo is a fast-growing plant. Fibre processing varies by maker, so we are upfront that we make no certification claims.' },
  { icon: 'heart', title: 'Gentle on skin', text: 'Smooth fibres and a low-friction weave make it a comfortable option for sensitive sleepers. (Not medical advice.)' },
];

export const comparison = {
  head: ['', 'Bamboo viscose', 'Typical cotton'],
  rows: [
    ['Feel', 'Silky and drapey', 'Crisp or brushed, depending on weave'],
    ['Breathability', 'Breathable, moisture-wicking', 'Breathable; varies with weave'],
    ['Temperature', 'Often described as cool to the touch', 'Varies; percale is crisp and cool, flannel is warm'],
    ['Softness over time', 'Tends to soften with washing', 'Depends on quality and weave'],
    ['Care', 'Machine washable', 'Machine washable'],
    ['Plant-based', 'Yes (bamboo cellulose)', 'Yes (cotton)'],
  ],
  note: 'General comparison of fabric types, not a lab test. Individual products differ.',
};

// Clearly-labelled placeholder content. Not from real customers. No names, no star ratings.
export const sampleReviews = [
  { title: 'Cool and smooth', body: 'Sample copy showing how a customer review will look: soft fabric, nice drape, and comfortable on warm nights.' },
  { title: 'Easy to wash', body: 'Sample copy showing how a customer review will look: came out of the wash soft and ready to go back on the bed.' },
  { title: 'Good fit', body: 'Sample copy showing how a customer review will look: deep pockets stayed on the mattress.' },
];

export const sizeTables = {
  mattress: {
    caption: 'Standard US mattress sizes',
    head: ['Size', 'Mattress (in)', 'Mattress (cm)'],
    rows: [
      ['Twin', '39 x 75', '99 x 191'],
      ['Full', '54 x 75', '137 x 191'],
      ['Queen', '60 x 80', '152 x 203'],
      ['King', '76 x 80', '193 x 203'],
    ],
  },
  duvet: {
    caption: 'Typical duvet insert sizes (standard US sizing)',
    head: ['Size', 'Typical duvet (in)'],
    rows: [
      ['Twin', '68 x 88'],
      ['Full/Queen', '88 x 92'],
      ['King', '104 x 90'],
    ],
  },
  pillow: {
    caption: 'Standard pillow sizes',
    head: ['Size', 'Pillow (in)'],
    rows: [
      ['Standard', '20 x 26'],
      ['King', '20 x 36'],
    ],
  },
};
