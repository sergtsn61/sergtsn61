import { useState } from 'react';
import { useCalculator } from './hooks/useCalculator';
import { useHistory } from './hooks/useHistory';
import { FilamentSection } from './components/Calculator/FilamentSection';
import { PrinterSection } from './components/Calculator/PrinterSection';
import { ElectricitySection } from './components/Calculator/ElectricitySection';
import { PostProcessingSection } from './components/Calculator/PostProcessingSection';
import { PricingSection } from './components/Calculator/PricingSection';
import { ResultPanel } from './components/Calculator/ResultPanel';
import { HistoryPanel } from './components/History/HistoryPanel';
import { Sidebar, SidebarTab } from './components/Layout/Sidebar';
import { exportSingleToPDF } from './utils/export';
import { createCalculationResult } from './utils/calculator';

function App() {
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

  return (
    <div className="flex h-screen bg-bg-primary overflow-hidden">
      {/* Боковая навигация */}
      <Sidebar
        active={activeTab}
        onChange={setActiveTab}
        historyCount={history.length}
      />

      {/* Основной контент */}
      <div className="flex flex-1 overflow-hidden">

        {/* ===== ВКЛАДКА КАЛЬКУЛЯТОРА ===== */}
        {activeTab === 'calculator' && (
          <>
            {/* Левая панель — параметры */}
            <div className="w-[340px] flex flex-col border-r border-border-subtle overflow-hidden">
              {/* Заголовок */}
              <div className="px-4 py-3.5 border-b border-border-subtle flex items-center gap-3">
                <input
                  type="text"
                  value={input.name}
                  onChange={e => updateName(e.target.value)}
                  placeholder="Название изделия..."
                  className="flex-1 bg-transparent text-sm font-semibold text-text-primary placeholder-text-muted focus:outline-none"
                />
              </div>

              {/* Секции параметров */}
              <div className="flex-1 overflow-y-auto p-3 space-y-2">
                <FilamentSection
                  data={input.filament}
                  onChange={updateFilament}
                />
                <ElectricitySection
                  data={input.electricity}
                  onChange={updateElectricity}
                />
                <PrinterSection
                  data={input.printer}
                  onChange={updatePrinter}
                  onChangePower={v => updateElectricity('powerConsumption', v)}
                />
                <PostProcessingSection
                  data={input.postProcessing}
                  onChange={updatePostProcessing}
                />
                <PricingSection
                  data={input.pricing}
                  onChange={updatePricing}
                />
              </div>
            </div>

            {/* Правая панель — результаты */}
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

        {/* ===== ВКЛАДКА ИСТОРИИ ===== */}
        {activeTab === 'history' && (
          <div className="flex-1 overflow-hidden">
            <HistoryPanel
              history={history}
              onLoad={handleLoadFromHistory}
              onDelete={remove}
              onClear={clear}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
