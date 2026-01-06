// Component Tests - RiskFlagsDisplay
// ============================================================================
// Tests for RiskFlagsDisplay component including risk levels and flag indicators

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { RiskFlagsDisplay } from '../../src/components/RiskFlags';
import type { RiskFlags } from '../../src/types';

describe('RiskFlagsDisplay', () => {
  const noFlags: RiskFlags = {
    acceleration: false,
    extraction: false,
    isolated: false,
    too_clean: false,
    erratic: false,
    new_badge: false,
  };

  const allFlags: RiskFlags = {
    acceleration: true,
    extraction: true,
    isolated: true,
    too_clean: true,
    erratic: true,
    new_badge: true,
  };

  describe('Normal View', () => {
    it('should render risk score header', () => {
      render(<RiskFlagsDisplay flags={noFlags} risk={25} />);

      expect(screen.getByText('Risk Score')).toBeInTheDocument();
      expect(screen.getByText('25')).toBeInTheDocument();
    });

    it('should display correct risk level for minimal risk (0-20)', () => {
      render(<RiskFlagsDisplay flags={noFlags} risk={10} />);

      expect(screen.getByText(/minimal/i)).toBeInTheDocument();
    });

    it('should display correct risk level for low risk (15-30)', () => {
      render(<RiskFlagsDisplay flags={noFlags} risk={20} />);

      // Check for the risk level label specifically (uppercase text)
      expect(screen.getByText('low', { selector: '.uppercase' })).toBeInTheDocument();
    });

    it('should display correct risk level for moderate risk (30-50)', () => {
      render(<RiskFlagsDisplay flags={noFlags} risk={40} />);

      expect(screen.getByText(/moderate/i)).toBeInTheDocument();
    });

    it('should display correct risk level for high risk (50-75)', () => {
      render(<RiskFlagsDisplay flags={noFlags} risk={60} />);

      // Check for the risk level label specifically (uppercase text)
      expect(screen.getByText('high', { selector: '.uppercase' })).toBeInTheDocument();
    });

    it('should display correct risk level for critical risk (80-100)', () => {
      render(<RiskFlagsDisplay flags={noFlags} risk={90} />);

      expect(screen.getByText(/critical/i)).toBeInTheDocument();
    });

    it('should render all risk flag labels', () => {
      render(<RiskFlagsDisplay flags={noFlags} risk={25} />);

      expect(screen.getByText('Acceleration')).toBeInTheDocument();
      expect(screen.getByText('Extraction')).toBeInTheDocument();
      expect(screen.getByText('Isolated')).toBeInTheDocument();
      expect(screen.getByText('Too Clean')).toBeInTheDocument();
      expect(screen.getByText('Erratic')).toBeInTheDocument();
      expect(screen.getByText('New Badge')).toBeInTheDocument();
    });

    it('should show weight values for each flag', () => {
      render(<RiskFlagsDisplay flags={noFlags} risk={25} />);

      // Check that weight indicators are present
      expect(screen.getByText('+25')).toBeInTheDocument(); // acceleration
      expect(screen.getByText('+30')).toBeInTheDocument(); // extraction
      expect(screen.getByText('+20')).toBeInTheDocument(); // isolated
      expect(screen.getByText('+10')).toBeInTheDocument(); // too_clean
      // There are TWO flags with +15 weight (erratic and new_badge)
      expect(screen.getAllByText('+15')).toHaveLength(2); // erratic AND new_badge
    });

    it('should highlight active flags', () => {
      const someFlags: RiskFlags = {
        ...noFlags,
        acceleration: true,
        new_badge: true,
      };

      const { container } = render(<RiskFlagsDisplay flags={someFlags} risk={25} />);

      // Active flags should have red styling - need to find the card div
      // Structure: card > flex-container > inner-flex > span
      const accelerationLabel = screen.getByText('Acceleration');
      const accelerationCard = accelerationLabel.parentElement?.parentElement?.parentElement;
      expect(accelerationCard?.className).toContain('bg-red-500/10');
      expect(accelerationCard?.className).toContain('border-red-500/30');

      const newBadgeLabel = screen.getByText('New Badge');
      const newBadgeCard = newBadgeLabel.parentElement?.parentElement?.parentElement;
      expect(newBadgeCard?.className).toContain('bg-red-500/10');

      // Inactive flags should have gray styling
      const extractionLabel = screen.getByText('Extraction');
      const extractionCard = extractionLabel.parentElement?.parentElement?.parentElement;
      expect(extractionCard?.className).toContain('bg-gray-800/50');
      expect(extractionCard?.className).toContain('border-gray-700');
    });

    it('should show descriptions for each flag', () => {
      render(<RiskFlagsDisplay flags={noFlags} risk={25} />);

      expect(screen.getByText(/Recent activity velocity exceeds/)).toBeInTheDocument();
      expect(screen.getByText(/Proposed value exceeds 10x/)).toBeInTheDocument();
      expect(screen.getByText(/Low network score/)).toBeInTheDocument();
      expect(screen.getByText(/High transaction count with zero/)).toBeInTheDocument();
      expect(screen.getByText(/High variance in transaction values/)).toBeInTheDocument();
      expect(screen.getByText(/Account age less than 90 days/)).toBeInTheDocument();
    });
  });

  describe('Compact View', () => {
    it('should render compact risk score', () => {
      render(<RiskFlagsDisplay flags={noFlags} risk={35} compact={true} />);

      expect(screen.getByText('35')).toBeInTheDocument();
    });

    it('should show icons for active flags only in compact mode', () => {
      const someFlags: RiskFlags = {
        ...noFlags,
        acceleration: true,
        extraction: true,
      };

      const { container } = render(<RiskFlagsDisplay flags={someFlags} risk={40} compact={true} />);

      // In compact mode, only active flags should have icons
      // We can't easily test icon components, but we can check that only 2 flag icons are rendered
      const flagIcons = container.querySelectorAll('[title]');
      expect(flagIcons.length).toBe(2);
      expect(flagIcons[0].getAttribute('title')).toBe('Acceleration');
      expect(flagIcons[1].getAttribute('title')).toBe('Extraction');
    });

    it('should not show flag labels in compact mode', () => {
      const someFlags: RiskFlags = {
        ...noFlags,
        acceleration: true,
      };

      render(<RiskFlagsDisplay flags={someFlags} risk={25} compact={true} />);

      // Labels should not be visible text in compact mode
      expect(screen.queryByText('Acceleration')).not.toBeInTheDocument();
      expect(screen.queryByText('Risk Score')).not.toBeInTheDocument();
    });

    it('should show no flag icons when all flags are false', () => {
      const { container } = render(<RiskFlagsDisplay flags={noFlags} risk={10} compact={true} />);

      const flagIcons = container.querySelectorAll('[title]');
      expect(flagIcons.length).toBe(0);
    });

    it('should show all flag icons when all flags are true', () => {
      const { container } = render(<RiskFlagsDisplay flags={allFlags} risk={90} compact={true} />);

      const flagIcons = container.querySelectorAll('[title]');
      expect(flagIcons.length).toBe(6);
    });
  });

  describe('Risk Color Coding', () => {
    it('should apply green color for minimal risk', () => {
      const { container } = render(<RiskFlagsDisplay flags={noFlags} risk={10} />);

      // Find the risk header div with the border class
      const riskHeader = container.querySelector('.border.rounded-lg');
      expect(riskHeader?.className).toContain('text-green-400');
      expect(riskHeader?.className).toContain('bg-green-500/10');
    });

    it('should apply cyan color for low risk', () => {
      const { container } = render(<RiskFlagsDisplay flags={noFlags} risk={20} />);

      const riskHeader = container.querySelector('.border.rounded-lg');
      expect(riskHeader?.className).toContain('text-cyan-400');
      expect(riskHeader?.className).toContain('bg-cyan-500/10');
    });

    it('should apply yellow color for moderate risk', () => {
      const { container } = render(<RiskFlagsDisplay flags={noFlags} risk={40} />);

      const riskHeader = container.querySelector('.border.rounded-lg');
      expect(riskHeader?.className).toContain('text-yellow-400');
      expect(riskHeader?.className).toContain('bg-yellow-500/10');
    });

    it('should apply orange color for high risk', () => {
      const { container } = render(<RiskFlagsDisplay flags={noFlags} risk={60} />);

      const riskHeader = container.querySelector('.border.rounded-lg');
      expect(riskHeader?.className).toContain('text-orange-400');
      expect(riskHeader?.className).toContain('bg-orange-500/10');
    });

    it('should apply red color for critical risk', () => {
      const { container } = render(<RiskFlagsDisplay flags={noFlags} risk={80} />);

      const riskHeader = container.querySelector('.border.rounded-lg');
      expect(riskHeader?.className).toContain('text-red-400');
      expect(riskHeader?.className).toContain('bg-red-500/10');
    });
  });

  describe('Edge Cases', () => {
    it('should handle risk score of 0', () => {
      render(<RiskFlagsDisplay flags={noFlags} risk={0} />);

      expect(screen.getByText('0')).toBeInTheDocument();
      expect(screen.getByText(/minimal/i)).toBeInTheDocument();
    });

    it('should handle risk score of 100', () => {
      render(<RiskFlagsDisplay flags={allFlags} risk={100} />);

      expect(screen.getByText('100')).toBeInTheDocument();
      expect(screen.getByText(/critical/i)).toBeInTheDocument();
    });

    it('should handle boundary at 15 (minimal to low)', () => {
      const { rerender } = render(<RiskFlagsDisplay flags={noFlags} risk={14} />);
      expect(screen.getByText(/minimal/i)).toBeInTheDocument();

      rerender(<RiskFlagsDisplay flags={noFlags} risk={15} />);
      // Check for the risk level label specifically (uppercase text)
      expect(screen.getByText('low', { selector: '.uppercase' })).toBeInTheDocument();
    });
  });

  describe('Memoization', () => {
    it('should be a memoized component', () => {
      // React.memo wraps the component, so we check that it's a memoized component
      // The displayName may or may not be set depending on React version
      expect(RiskFlagsDisplay).toBeDefined();
      expect(typeof RiskFlagsDisplay).toBe('object');
    });
  });
});
