import './LandingBlock.css';

type LandingBlockProps = {
  variant: 'blue' | 'white';
  children: React.ReactNode;
}

export const LandingBlock = ({ variant , children }: LandingBlockProps) => {
  return (
    <div className={`landing-block ${variant}`}>
      <div className="content">{children}</div>
    </div>
  );
};