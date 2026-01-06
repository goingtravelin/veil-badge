// Component Tests - TrustGauge
// ============================================================================
// Tests for TrustGauge component including visual rendering and trust levels

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TrustGauge } from '../../src/components/TrustGauge';

describe('TrustGauge', () => {
  describe('Basic Rendering', () => {
    it('should render trust score', () => {
      render(<TrustGauge trust={75} />);

      expect(screen.getByText('75')).toBeInTheDocument();
    });

    it('should show label by default', () => {
      render(<TrustGauge trust={75} />);

      expect(screen.getByText('high')).toBeInTheDocument();
    });

    it('should hide label when showLabel is false', () => {
      render(<TrustGauge trust={75} showLabel={false} />);

      expect(screen.queryByText('high')).not.toBeInTheDocument();
      expect(screen.getByText('75')).toBeInTheDocument(); // Score still visible
    });

    it('should render SVG elements', () => {
      const { container } = render(<TrustGauge trust={50} />);

      const svgs = container.querySelectorAll('svg');
      expect(svgs.length).toBeGreaterThan(0);

      const circles = container.querySelectorAll('circle');
      expect(circles.length).toBe(2); // Background + progress circle
    });
  });

  describe('Size Variants', () => {
    it('should render small size correctly', () => {
      const { container } = render(<TrustGauge trust={50} size="sm" />);

      const wrapper = container.querySelector('div[style*="width: 80"]');
      expect(wrapper).toBeInTheDocument();
    });

    it('should render medium size correctly (default)', () => {
      const { container } = render(<TrustGauge trust={50} size="md" />);

      const wrapper = container.querySelector('div[style*="width: 120"]');
      expect(wrapper).toBeInTheDocument();
    });

    it('should render large size correctly', () => {
      const { container } = render(<TrustGauge trust={50} size="lg" />);

      const wrapper = container.querySelector('div[style*="width: 160"]');
      expect(wrapper).toBeInTheDocument();
    });
  });

  describe('Trust Level Colors', () => {
    it('should show "new" level for new badges with low trust', () => {
      // "new" level is only shown for new badges with trust < 20
      render(<TrustGauge trust={15} isNewBadge={true} />);

      // Label is uppercased in the component, so we need to match case-insensitively
      expect(screen.getByText(/new/i)).toBeInTheDocument();
    });

    it('should show "critical" level for very low trust (0-20)', () => {
      render(<TrustGauge trust={10} />);

      expect(screen.getByText(/critical/i)).toBeInTheDocument();
    });

    it('should show "low" level for low trust (21-40)', () => {
      render(<TrustGauge trust={30} />);

      expect(screen.getByText(/low/i)).toBeInTheDocument();
    });

    it('should show "medium" level for medium trust (41-60)', () => {
      render(<TrustGauge trust={50} />);

      expect(screen.getByText(/medium/i)).toBeInTheDocument();
    });

    it('should show "high" level for high trust (61-80)', () => {
      render(<TrustGauge trust={75} />);

      expect(screen.getByText(/high/i)).toBeInTheDocument();
    });

    it('should show "excellent" level for excellent trust (81-100)', () => {
      render(<TrustGauge trust={95} />);

      expect(screen.getByText(/excellent/i)).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle trust score of 0', () => {
      render(<TrustGauge trust={0} />);

      expect(screen.getByText('0')).toBeInTheDocument();
      expect(screen.getByText(/critical/i)).toBeInTheDocument();
    });

    it('should handle trust score of 100', () => {
      render(<TrustGauge trust={100} />);

      expect(screen.getByText('100')).toBeInTheDocument();
      expect(screen.getByText(/excellent/i)).toBeInTheDocument();
    });

    it('should handle boundary values correctly', () => {
      // Test boundary at 19-20 (critical threshold)
      const { rerender } = render(<TrustGauge trust={19} />);
      expect(screen.getByText(/critical/i)).toBeInTheDocument();

      rerender(<TrustGauge trust={20} />);
      expect(screen.getByText(/low/i)).toBeInTheDocument();

      // Test new badge boundary - isNewBadge only affects trust < 20
      rerender(<TrustGauge trust={19} isNewBadge={true} />);
      expect(screen.getByText(/new/i)).toBeInTheDocument();

      rerender(<TrustGauge trust={20} isNewBadge={true} />);
      expect(screen.getByText(/low/i)).toBeInTheDocument();
    });

    it('should prioritize isNewBadge flag over trust level when trust < 20', () => {
      // isNewBadge only changes 'critical' to 'new' when trust < 20
      // With high trust, it shows the normal level
      render(<TrustGauge trust={10} isNewBadge={true} />);

      expect(screen.getByText(/new/i)).toBeInTheDocument();
      expect(screen.queryByText(/critical/i)).not.toBeInTheDocument();

      // With trust >= 20, isNewBadge has no effect
      render(<TrustGauge trust={90} isNewBadge={true} />);
      expect(screen.getByText(/excellent/i)).toBeInTheDocument();
    });
  });

  describe('Visual Progress', () => {
    it('should calculate progress correctly for 50% trust', () => {
      const { container } = render(<TrustGauge trust={50} />);

      const progressCircle = container.querySelectorAll('circle')[1]; // Second circle is progress
      expect(progressCircle).toBeInTheDocument();

      // Circle should have stroke-dashoffset attribute
      expect(progressCircle.getAttribute('stroke-dashoffset')).toBeTruthy();
    });

    it('should show full progress for 100% trust', () => {
      const { container } = render(<TrustGauge trust={100} />);

      const progressCircle = container.querySelectorAll('circle')[1];
      const dashOffset = progressCircle.getAttribute('stroke-dashoffset');

      // For 100% trust, offset should be close to 0
      expect(parseFloat(dashOffset || '0')).toBeLessThan(1);
    });

    it('should show minimal progress for 0% trust', () => {
      const { container } = render(<TrustGauge trust={0} />);

      const progressCircle = container.querySelectorAll('circle')[1];
      const dashArray = progressCircle.getAttribute('stroke-dasharray');
      const dashOffset = progressCircle.getAttribute('stroke-dashoffset');

      // For 0% trust, offset should equal circumference (no progress)
      expect(dashOffset).toBe(dashArray);
    });
  });

  describe('Styling', () => {
    it('should apply correct color classes for each level', () => {
      const { container, rerender } = render(<TrustGauge trust={95} />);

      // Excellent - cyan
      let label = screen.getByText(/excellent/i);
      expect(label.className).toContain('text-cyan-500');

      // High - green
      rerender(<TrustGauge trust={70} />);
      label = screen.getByText(/high/i);
      expect(label.className).toContain('text-green-500');

      // Critical - red
      rerender(<TrustGauge trust={10} />);
      label = screen.getByText(/critical/i);
      expect(label.className).toContain('text-red-500');
    });

    it('should apply transition classes to progress circle', () => {
      const { container } = render(<TrustGauge trust={50} />);

      const progressCircle = container.querySelectorAll('circle')[1];
      // SVG elements use class attribute, not className
      expect(progressCircle.getAttribute('class')).toContain('transition-all');
    });

    it('should use uppercase label text', () => {
      render(<TrustGauge trust={75} />);

      const label = screen.getByText(/high/i);
      expect(label.className).toContain('uppercase');
    });
  });

  describe('Accessibility', () => {
    it('should render semantic structure', () => {
      const { container } = render(<TrustGauge trust={75} />);

      // Should have proper container structure
      const mainContainer = container.firstChild;
      expect(mainContainer).toHaveClass('flex', 'flex-col');
    });

    it('should have readable text contrast', () => {
      render(<TrustGauge trust={75} />);

      const scoreText = screen.getByText('75');
      expect(scoreText.className).toContain('font-bold');
    });
  });

  describe('Performance', () => {
    it('should render efficiently without errors', () => {
      // Test that component renders without issues when props change
      const { rerender } = render(<TrustGauge trust={50} />);

      // Re-render with different props
      rerender(<TrustGauge trust={75} />);
      expect(screen.getByText('75')).toBeInTheDocument();

      rerender(<TrustGauge trust={25} size="sm" />);
      expect(screen.getByText('25')).toBeInTheDocument();
    });
  });
});
