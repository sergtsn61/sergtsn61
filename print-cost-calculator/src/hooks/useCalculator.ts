import { useState, useEffect, useCallback } from 'react';
import { CalculationInput, CostBreakdown } from '../types/calculation';
import { calculateCosts, createCalculationResult } from '../utils/calculator';
import { saveCalculation, saveDraft, loadDraft } from '../utils/storage';

const DEFAULT_INPUT: CalculationInput = {
  name: '',
  filament: {
    spoolWeight: 1000,
    spoolPrice: 1500,
    usedWeight: 50,
    wasteFactor: 10,
  },
  printer: {
    printerCost: 25000,
    printerLifespan: 5000,
    maintenanceCost: 3000,
    maintenanceHoursPerYear: 1000,
  },
  electricity: {
    powerConsumption: 200,
    electricityRate: 5.5,
    printDuration: 4,
  },
  postProcessing: {
    removalTime: 10,
    removalRate: 500,
    paintingCost: 0,
    assemblyTime: 0,
  },
  pricing: {
    profitMargin: 100,
    overhead: 15,
    quantity: 1,
  },
};

export function useCalculator() {
  const [input, setInput] = useState<CalculationInput>(() => {
    const draft = loadDraft();
    return draft ?? DEFAULT_INPUT;
  });

  const [breakdown, setBreakdown] = useState<CostBreakdown>(() =>
    calculateCosts(DEFAULT_INPUT)
  );

  const [savedId, setSavedId] = useState<string | null>(null);

  // Пересчёт при изменении параметров
  useEffect(() => {
    const result = calculateCosts(input);
    setBreakdown(result);
    saveDraft(input);
    setSavedId(null);
  }, [input]);

  const updateFilament = useCallback(<K extends keyof CalculationInput['filament']>(
    key: K, value: CalculationInput['filament'][K]
  ) => {
    setInput(prev => ({ ...prev, filament: { ...prev.filament, [key]: value } }));
  }, []);

  const updatePrinter = useCallback(<K extends keyof CalculationInput['printer']>(
    key: K, value: CalculationInput['printer'][K]
  ) => {
    setInput(prev => ({ ...prev, printer: { ...prev.printer, [key]: value } }));
  }, []);

  const updateElectricity = useCallback(<K extends keyof CalculationInput['electricity']>(
    key: K, value: CalculationInput['electricity'][K]
  ) => {
    setInput(prev => ({ ...prev, electricity: { ...prev.electricity, [key]: value } }));
  }, []);

  const updatePostProcessing = useCallback(<K extends keyof CalculationInput['postProcessing']>(
    key: K, value: CalculationInput['postProcessing'][K]
  ) => {
    setInput(prev => ({ ...prev, postProcessing: { ...prev.postProcessing, [key]: value } }));
  }, []);

  const updatePricing = useCallback(<K extends keyof CalculationInput['pricing']>(
    key: K, value: CalculationInput['pricing'][K]
  ) => {
    setInput(prev => ({ ...prev, pricing: { ...prev.pricing, [key]: value } }));
  }, []);

  const updateName = useCallback((name: string) => {
    setInput(prev => ({ ...prev, name }));
  }, []);

  const saveToHistory = useCallback(() => {
    const result = createCalculationResult(input);
    saveCalculation(result);
    setSavedId(result.id);
    return result;
  }, [input]);

  const loadFromHistory = useCallback((savedInput: CalculationInput) => {
    setInput(savedInput);
  }, []);

  const resetToDefault = useCallback(() => {
    setInput(DEFAULT_INPUT);
  }, []);

  return {
    input,
    breakdown,
    savedId,
    updateFilament,
    updatePrinter,
    updateElectricity,
    updatePostProcessing,
    updatePricing,
    updateName,
    saveToHistory,
    loadFromHistory,
    resetToDefault,
  };
}
