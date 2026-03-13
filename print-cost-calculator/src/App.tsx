import { useState, useCallback } from 'react';
import { useCalculator } from './hooks/useCalculator';
import { useHistory } from './hooks/useHistory';
import { useTheme } from './hooks/useTheme';
import { useI18n } from './i18n';
import { FilamentSection } from './components/Calculator/FilamentSection';
import { PrinterSection } from './components/Calculator/PrinterSection';
import { ElectricitySection } from './components/Calculator/ElectricitySection';
import { PostProcessingSection } from './components/Calculator/PostProcessingSection';
import { PricingSection } from './components/Calculator/PricingSection';
import { ResultPanel } from './components/Calculator/ResultPanel';
import { GCodeDropZone } from './components/Calculator/GCodeDropZone';
import { HistoryPanel } from './components/History/HistoryPanel';
import { Sidebar, SidebarTab } from './components/Layout/Sidebar';
import { exportSingleToPDF } from './utils/export';
import { createCalculationResult } from './utils/calculator';
import { GCodeInfo } from './utils/gcode';

function App() {
  const { t } = useI18n();
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<SidebarTab>('calculator');

  const {
    input, breakdown, savedId,
    updateFilament, updatePrinter, updateElectricity,
    updatePostProcessing, updatePricing, updateName,
    saveToHistory, loadFromHistory, resetToDefault,
  } = useCalculator();

  const { history, refresh, remove, clear } = useHistory();

  const handleSave = () => {
    saveToHistory();
    refresh();
  };

  const handleExportPDF = () => {
    const result = createCalculationResult(input);
    exportSingleToPDF(result);
  };

  const handleLoadFromHistory = (result: typeof history[0]) => {
    loadFromHistory(result.input);
    setActiveTab('calculator');
  };

  const handleGCodeParsed = useCallback((info: GCodeInfo) => {
    if (info.weight != null) updateFilament('usedWeight', info.weight);
    if (info.duration != null) updateElectricity('printDuration', info.duration);
  }, [updateFilament, updateElectricity]);

  return (
    <div className="flex h-screen bg-bg-primary overflow-hidden transition-colors duration-300">
      <Sidebar
        active={activeTab}
        onChange={setActiveTab}
        historyCount={history.length}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      <div className="flex flex-1 overflow-hidden">
        {activeTab === 'calculator' && (
          <>
            <div className="w-[340px] flex flex-col border-r border-border-subtle overflow-hidden transition-colors duration-300">
              <div className="px-4 py-3.5 border-b border-border-subtle flex items-center gap-3">
                <input
                  type="text"
                  value={input.name}
                  onChange={e => updateName(e.target.value)}
                  placeholder={t.app.productName}
                  className="flex-1 bg-transparent text-sm font-semibold text-text-primary placeholder-text-muted focus:outline-none"
                />
              </div>

              <div className="flex-1 overflow-y-auto p-3 space-y-2">
                <GCodeDropZone onParsed={handleGCodeParsed} />
                <FilamentSection data={input.filament} onChange={updateFilament} />
                <ElectricitySection data={input.electricity} onChange={updateElectricity} />
                <PrinterSection data={input.printer} onChange={updatePrinter} onChangePower={v => updateElectricity('powerConsumption', v)} />
                <PostProcessingSection data={input.postProcessing} onChange={updatePostProcessing} />
                <PricingSection data={input.pricing} onChange={updatePricing} />
              </div>
            </div>

            <div className="flex-1 overflow-hidden">
              <ResultPanel
                breakdown={breakdown}
                pricing={input.pricing}
                onSave={handleSave}
                onExportPDF={handleExportPDF}
                onReset={resetToDefault}
                savedId={savedId}
              />
            </div>
          </>
        )}

        {activeTab === 'history' && (
          <div className="flex-1 overflow-hidden">
            <HistoryPanel history={history} onLoad={handleLoadFromHistory} onDelete={remove} onClear={clear} />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
