import React, { ReactNode } from 'react';

interface PanelProps {
  children: ReactNode;
  className?: string;
}

interface PanelSubComponentProps {
  children: ReactNode;
  className?: string;
}

const PanelHeader: React.FC<PanelSubComponentProps> = ({ children, className = '' }) => (
  <div className={`bg-gray-100 px-4 py-3 border-b rounded-t-md ${className}`}>
    {children}
  </div>
);

const PanelContent: React.FC<PanelSubComponentProps> = ({ children, className = '' }) => (
  <div className={`p-6 bg-white ${className}`}>
    {children}
  </div>
);

const PanelFooter: React.FC<PanelSubComponentProps> = ({ children, className = '' }) => (
  <div className={`px-4 py-3 border-t bg-gray-50 rounded-b-md ${className}`}>
    {children}
  </div>
);

const Panel: React.FC<PanelProps> & {
  Header: typeof PanelHeader;
  Content: typeof PanelContent;
  Footer: typeof PanelFooter;
} = ({ children, className = '' }) => {
  return (
    <div className={`rounded-md shadow-sm border overflow-hidden ${className}`}>
      {children}
    </div>
  );
};

Panel.Header = PanelHeader;
Panel.Content = PanelContent;
Panel.Footer = PanelFooter;

export default Panel;
