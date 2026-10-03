'use client';

import Icon from './Icons';
import { MAX_QTY } from '../lib/cart';

export default function QtyStepper({ value, onChange, min = 1, label = 'Quantity' }) {
  return (
    <div className="stepper" role="group" aria-label={label}>
      <button type="button" onClick={() => onChange(value - 1)} disabled={value <= min} aria-label="Decrease quantity"><Icon name="minus" size={16} /></button>
      <output aria-live="polite">{value}</output>
      <button type="button" onClick={() => onChange(value + 1)} disabled={value >= MAX_QTY} aria-label="Increase quantity"><Icon name="plus" size={16} /></button>
    </div>
  );
}
