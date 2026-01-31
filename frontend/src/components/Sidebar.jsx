import './Sidebar.css'

function Sidebar({
  formations,
  loading,
  currentFormation,
  onFormationSelect,
  settings,
  onSettingsChange
}) {
  const formationsList = [
    { id: '4-3-3', name: '4-3-3', category: 'attacking' },
    { id: '4-2-3-1', name: '4-2-3-1', category: 'balanced' },
    { id: '4-4-2', name: '4-4-2', category: 'balanced' },
    { id: '3-5-2', name: '3-5-2', category: 'balanced' },
    { id: '4-1-4-1', name: '4-1-4-1', category: 'defensive' },
    { id: '5-3-2', name: '5-3-2', category: 'defensive' },
    { id: '4-3-1-2', name: '4-3-1-2', category: 'attacking' },
    { id: '3-4-3', name: '3-4-3', category: 'attacking' }
  ]

  const pitchStyles = [
    { id: 'grass', label: 'Grass', color: '#2e7d32' },
    { id: 'dark', label: 'Dark', color: '#1a472a' },
    { id: 'light', label: 'Light', color: '#4a8f4a' },
    { id: 'minimal', label: 'Minimal', color: '#2d5a2d' }
  ]

  const jerseyColors = [
    '#ff0000', '#0066cc', '#ffd700', '#ffffff',
    '#000000', '#ff6b00', '#800080', '#00a86b'
  ]

  return (
    <aside className="sidebar">
      {/* Formation Selector */}
      <section className="sidebar-section">
        <h3 className="sidebar-title">Formation</h3>
        <div className="formation-grid">
          {formationsList.map(f => (
            <button
              key={f.id}
              className={`formation-btn ${currentFormation === f.id ? 'formation-btn--active' : ''}`}
              onClick={() => onFormationSelect(f.id)}
            >
              <span className="formation-name">{f.name}</span>
              <span className={`formation-category formation-category--${f.category}`}>
                {f.category}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Pitch Style */}
      <section className="sidebar-section">
        <h3 className="sidebar-title">Pitch Style</h3>
        <div className="style-grid">
          {pitchStyles.map(style => (
            <button
              key={style.id}
              className={`style-btn ${settings.pitchStyle === style.id ? 'style-btn--active' : ''}`}
              onClick={() => onSettingsChange({ pitchStyle: style.id })}
              title={style.label}
            >
              <span 
                className="style-preview"
                style={{ backgroundColor: style.color }}
              />
              <span className="style-label">{style.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Jersey Color */}
      <section className="sidebar-section">
        <h3 className="sidebar-title">Jersey Color</h3>
        <div className="color-grid">
          {jerseyColors.map(color => (
            <button
              key={color}
              className={`color-btn ${settings.jerseyColor === color ? 'color-btn--active' : ''}`}
              style={{ backgroundColor: color }}
              onClick={() => onSettingsChange({ jerseyColor: color })}
              title={color}
            />
          ))}
          <input
            type="color"
            value={settings.jerseyColor}
            onChange={(e) => onSettingsChange({ jerseyColor: e.target.value })}
            className="color-picker"
            title="Custom color"
          />
        </div>
      </section>

      {/* Display Options */}
      <section className="sidebar-section">
        <h3 className="sidebar-title">Display</h3>
        <div className="toggle-list">
          <label className="toggle-item">
            <input
              type="checkbox"
              checked={settings.showNames}
              onChange={(e) => onSettingsChange({ showNames: e.target.checked })}
            />
            <span className="toggle-label">Show Names</span>
          </label>
          <label className="toggle-item">
            <input
              type="checkbox"
              checked={settings.showNumbers}
              onChange={(e) => onSettingsChange({ showNumbers: e.target.checked })}
            />
            <span className="toggle-label">Show Numbers</span>
          </label>
          <label className="toggle-item">
            <input
              type="checkbox"
              checked={settings.showPhotos}
              onChange={(e) => onSettingsChange({ showPhotos: e.target.checked })}
            />
            <span className="toggle-label">Show Photos</span>
          </label>
        </div>
      </section>

      {/* Orientation */}
      <section className="sidebar-section">
        <h3 className="sidebar-title">Orientation</h3>
        <div className="orientation-btns">
          <button
            className={`orient-btn ${settings.flippedHorizontal ? 'orient-btn--active' : ''}`}
            onClick={() => onSettingsChange({ flippedHorizontal: !settings.flippedHorizontal })}
            title="Flip Horizontal"
          >
            ↔️ Flip H
          </button>
          <button
            className={`orient-btn ${settings.flippedVertical ? 'orient-btn--active' : ''}`}
            onClick={() => onSettingsChange({ flippedVertical: !settings.flippedVertical })}
            title="Flip Vertical"
          >
            ↕️ Flip V
          </button>
        </div>
      </section>

      {/* Aspect Ratio */}
      <section className="sidebar-section">
        <h3 className="sidebar-title">Export Size</h3>
        <div className="aspect-btns">
          {['square', 'portrait', 'landscape'].map(ratio => (
            <button
              key={ratio}
              className={`aspect-btn ${settings.aspectRatio === ratio ? 'aspect-btn--active' : ''}`}
              onClick={() => onSettingsChange({ aspectRatio: ratio })}
            >
              <span className={`aspect-icon aspect-icon--${ratio}`} />
              <span className="aspect-label">{ratio}</span>
            </button>
          ))}
        </div>
      </section>
    </aside>
  )
}

export default Sidebar
