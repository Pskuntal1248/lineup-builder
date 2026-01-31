import './Toolbar.css'

function Toolbar({
  onExport,
  exporting,
  onClear,
  settings,
  onSettingsChange
}) {
  return (
    <header className="toolbar">
      <div className="toolbar-brand">
        <span className="toolbar-logo">⚽</span>
        <h1 className="toolbar-title">Lineup Generator</h1>
      </div>
      
      <div className="toolbar-actions">
        <button 
          className="toolbar-btn toolbar-btn--secondary"
          onClick={onClear}
          title="Clear lineup"
        >
          🗑️ Clear
        </button>
        
        <div className="toolbar-divider" />
        
        <label className="toolbar-toggle">
          <input
            type="checkbox"
            checked={settings.showBranding}
            onChange={(e) => onSettingsChange({ showBranding: e.target.checked })}
          />
          <span>Branding</span>
        </label>
        
        <div className="toolbar-divider" />
        
        <button
          className="toolbar-btn toolbar-btn--primary"
          onClick={() => onExport('png')}
          disabled={exporting}
        >
          {exporting ? '⏳ Exporting...' : '📥 Download PNG'}
        </button>
        
        <button
          className="toolbar-btn toolbar-btn--secondary"
          onClick={() => onExport('svg')}
          disabled={exporting}
          title="Download as SVG"
        >
          SVG
        </button>
      </div>
    </header>
  )
}

export default Toolbar
