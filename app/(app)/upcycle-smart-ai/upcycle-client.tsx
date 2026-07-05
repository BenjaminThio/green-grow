'use client';

/* TensorFlow.js + MobileNet are loaded from CDN at runtime. */
declare global {
    interface Window {
        tf?: unknown;
        mobilenet?: { load: () => Promise<{ classify: (img: HTMLImageElement) => Promise<{ className: string; probability: number }[]> }> };
    }
}
import React, { useState, useRef, useEffect } from 'react';
import { 
    Camera, 
    Recycle, 
    Leaf, 
    AlertTriangle, 
    Flame, 
    Trash2, 
    ScanLine, 
    CheckCircle2, 
    Loader2,
    Sprout,
} from 'lucide-react';
import Image from 'next/image';

interface WasteData {
  material: string;
  category: string;
  binColor: string;
  action: string;
  instruction: string;
  benefit: string;
  burn: string;
  landfill: string;
}

interface Prediction {
  className: string;
  probability: number;
}

const wasteDatabase: Record<string, WasteData> = {
  'food': {
    material: "Organic Food Waste",
    category: "Biodegradable",
    binColor: "bg-lime-600",
    action: "Decompose / Compost",
    instruction: "This item must be decomposed. Place in a Compost Bin, Green Bin, or Food Waste Caddy.",
    benefit: "Decomposing food creates nutrient-rich soil (humus) and prevents methane emissions.",
    burn: "Inefficient: Wet food lowers incinerator temperature and creates extra smoke/pollution.",
    landfill: "Rotting food produces Methane (CH4), a gas 25x more potent at trapping heat than CO2."
  },
  'bottle': {
    material: "Plastic (PET)",
    category: "Recyclable",
    binColor: "bg-blue-500",
    action: "Recycle Bin",
    instruction: "Place in the Blue Recycle Bin. Please remove the cap and rinse.",
    benefit: "Recycling 1 ton of plastic saves 5,774 kWh of energy and 16.3 barrels of oil.",
    burn: "Releases Dioxins (carcinogens) and Furans which disrupt human hormones and immune systems.",
    landfill: "Takes 450+ years to degrade. Breaks into microplastics that contaminate groundwater and marine life."
  },
  'can': {
    material: "Aluminum",
    category: "Recyclable",
    binColor: "bg-gray-500",
    action: "Metal Bin",
    instruction: "Place in the Metal Recycle Bin. Rinse out food residue.",
    benefit: "Recycling aluminum uses 95% less energy than mining raw bauxite ore.",
    burn: "Releases Aluminum Oxide dust and toxic fumes from plastic linings, damaging lung tissue.",
    landfill: "Wastes valuable metal and creates leachate that poisons groundwater."
  },
  'tin_can': {
    material: "Steel / Tin",
    category: "Recyclable",
    binColor: "bg-gray-600",
    action: "Metal Bin",
    instruction: "Place in Metal Bin. If it contains food, rinse it out. Labels are usually fine.",
    benefit: "Steel is the most recycled material in the world. Recycling it saves 74% energy vs mining iron ore.",
    burn: "Does not burn. The plastic/varnish lining releases toxic emissions.",
    landfill: "Rusts over 50 years. A complete waste of non-renewable iron resources."
  },
  'glass': {
    material: "Silica Glass",
    category: "Recyclable",
    binColor: "bg-teal-600",
    action: "Glass Bin",
    instruction: "Place in the Glass Bin. Remove lids. Do not break.",
    benefit: "Glass is 100% recyclable and can be recycled endlessly without losing purity or quality.",
    burn: "Glass does not burn. It creates 'clinkers' (hot blobs) that damage incinerator machinery.",
    landfill: "It never decomposes (1 million+ years). It takes up permanent space in the earth."
  },
  'ceramic': {
    material: "Ceramic / Clay",
    category: "General Waste",
    binColor: "bg-stone-500",
    action: "General Waste",
    instruction: "Do NOT put in Glass Bin. Ceramics melt at higher temps and ruin glass recycling.",
    benefit: "Proper disposal prevents contamination of recyclable glass batches.",
    burn: "Does not burn. It is inert ash in an incinerator.",
    landfill: "Acts as inert rubble. Does not decompose but takes up space."
  },
  'styrofoam': {
    material: "Polystyrene (EPS)",
    category: "Hard to Recycle",
    binColor: "bg-slate-400",
    action: "General Waste",
    instruction: "Most curbside bins do NOT accept Styrofoam. Check for special drop-off centers.",
    benefit: "Reducing use is best. EPS takes up massive volume in landfills despite low weight.",
    burn: "Releases styrene gas and thick black smoke. Highly toxic to nervous systems.",
    landfill: "Takes 500+ years to degrade. Easily blows away and becomes ocean litter."
  },
  'wood': {
    material: "Wood / Timber",
    category: "Recyclable/Compostable",
    binColor: "bg-amber-700",
    action: "Wood / Garden Bin",
    instruction: "Small pieces: Compost. Large/Treated: Special Wood Recycling Skip.",
    benefit: "Can be chipped into mulch or used for biomass energy.",
    burn: "Releases carbon stored in the wood. Treated wood (varnish/paint) releases toxic chemicals.",
    landfill: "Rots anaerobically producing Methane. Wastes useful biomass."
  },
  'carton': {
    material: "Paper Composite",
    category: "Recyclable",
    binColor: "bg-orange-400",
    action: "Mixed Recycling",
    instruction: "Flatten and place in Mixed Recycling. Remove plastic straw/cap.",
    benefit: "Recovers paper fiber for reuse and reduces deforestation.",
    burn: "Releases a toxic mix of metallic ash (from foil) and plastic fumes (from lining).",
    landfill: "The paper layer rots producing methane, while the plastic/aluminum layers persist forever."
  },
  'paper': {
    material: "Cellulose Paper",
    category: "Recyclable",
    binColor: "bg-blue-600",
    action: "Paper Bin",
    instruction: "Place in the Paper Bin. Keep it dry and clean from grease.",
    benefit: "Recycling paper produces 73% less air pollution than making paper from raw wood pulp.",
    burn: "Releases Carbon Monoxide and particulate matter (soot), worsening asthma and air quality.",
    landfill: "Decomposes anaerobically to generate high volumes of Methane, contributing to climate change."
  },
  'electronic': {
    material: "E-Waste / PCB",
    category: "Hazardous",
    binColor: "bg-purple-600",
    action: "E-Waste Center",
    instruction: "Do NOT bin. Take to a specialized E-Waste collection point.",
    benefit: "Recovers rare earth metals (Gold, Silver, Palladium) that are destructive to mine.",
    burn: "DEADLY. Batteries explode. Burning wire insulation releases neurotoxins (Lead/Mercury vapor).",
    landfill: "Heavy metals (Lead, Mercury, Cadmium) leach into the soil, poisoning water supplies."
  },
  'device_component': {
    material: "Electronic Component",
    category: "Hazardous",
    binColor: "bg-purple-700",
    action: "E-Waste Specialist",
    instruction: "This is an internal component (Circuit Board/HDD/Battery). Handle with care. E-Waste only.",
    benefit: "Circuit boards are rich in gold and copper. Recycling 1 million boards saves huge mining efforts.",
    burn: "Releases extremely toxic Brominated Flame Retardants (BFRs) and heavy metal fumes.",
    landfill: "Highly toxic. One battery can contaminate thousands of liters of groundwater."
  },
  'textile': {
    material: "Fabric / Textile",
    category: "Reusable/Recyclable",
    binColor: "bg-pink-500",
    action: "Donation / Textile Bank",
    instruction: "Clean clothes: Donate. Rags/Damaged: Textile Recycling Bank.",
    benefit: "Extends the life of garments and reduces the massive water consumption of growing new cotton.",
    burn: "Synthetic fibers (polyester) melt and release micro-plastic smoke.",
    landfill: "Synthetic clothes do not decompose. Natural fibers decompose producing methane."
  },
  'hard_plastic': {
    material: "Rigid Plastic (HDPE/PP)",
    category: "Recyclable (Check Local)",
    binColor: "bg-cyan-600",
    action: "Rigid Plastic Bin",
    instruction: "Check for resin code #2 or #5. Often accepted in curbside or special drop-off.",
    benefit: "Recycling rigid plastics prevents the need for virgin polymer production.",
    burn: "Produces thick black toxic smoke and sticky soot.",
    landfill: "Occupies massive volume and persists for centuries."
  },
  'metal_utensil': {
    material: "Stainless Steel / Silverware",
    category: "Scrap Metal / Reuse",
    binColor: "bg-slate-500",
    action: "Donate or Scrap",
    instruction: "Good condition? Donate. Damaged? Scrap Metal Center (Not usually Curbside).",
    benefit: "Steel is highly recyclable. Reusing cutlery reduces single-use plastic waste.",
    burn: "Does not burn. Wastes energy in incineration process.",
    landfill: "A waste of refined steel resources."
  },
  'cookware': {
    material: "Mixed Metal (Teflon/Copper)",
    category: "Scrap Metal",
    binColor: "bg-zinc-600",
    action: "Scrap Metal Yard",
    instruction: "Do NOT put in standard recycling (coatings cause issues). Take to a Scrap Metal Yard.",
    benefit: "Recycling mixed metals reduces the massive ecological footprint of mining.",
    burn: "Non-stick coatings (PTFE) release toxic fluoride gases when overheated.",
    landfill: "Takes up massive space and wastes valuable metal."
  },
  'food_container': {
    material: "Mixed: Food + Plastic/Paper",
    category: "Separate & Sort",
    binColor: "bg-orange-500",
    action: "Empty Food → Rinse → Recycle",
    instruction: "1. Scrape food into Green Bin (Compost). 2. Rinse the container. 3. Recycle the clean container (Check label).",
    benefit: "Prevents contamination! Food ruins recycling batches, while the container is valuable if clean.",
    burn: "Burning plastic containers with wet food is highly inefficient and creates toxic smoke.",
    landfill: "Trapped food rots into Methane. The plastic container lasts for centuries."
  },
  'container': {
    material: "Polypropylene (PP)",
    category: "Reusable",
    binColor: "bg-teal-500",
    action: "Reuse / Rigid Plastic",
    instruction: "Wash and reuse for storage! If broken, recycle with Rigid Plastics (Code #5).",
    benefit: "Reusing containers is the highest form of sustainability.",
    burn: "Releases toxic black smoke and carcinogens.",
    landfill: "Microplastics leach into soil and water sources."
  },
  'snack': {
    material: "Metallized Plastic Film",
    category: "General Waste",
    binColor: "bg-stone-500",
    action: "General Waste",
    instruction: "Crisp packets & candy wrappers are multi-layered. Put in General Waste (unless you have a TerraCycle point).",
    benefit: "Proper disposal prevents these lightweight plastics from blowing into oceans and rivers.",
    burn: "Releases toxic fumes and micro-plastics into the air.",
    landfill: "Takes decades to degrade, breaking into microscopic plastic particles."
  },
  'plastic_cup': {
    material: "Plastic (PP / PS)",
    category: "Recyclable (Check Code)",
    binColor: "bg-blue-500",
    action: "Recycle (If Clean)",
    instruction: "Check bottom: #1, #2, #5 = Recycle. #6 (PS) or Dirty = General Waste. Remove foil lids.",
    benefit: "Recycling rigid plastic cups reduces demand for virgin oil-based plastics.",
    burn: "Releases dark, acrid smoke and toxic chemicals.",
    landfill: "Persists for 450+ years. Breaks down into microplastics."
  },
  'manual_check': {
    material: "Unidentified Composite",
    category: "Mixed / Check Label",
    binColor: "bg-slate-500",
    action: "Manual Check",
    instruction: "Look for a triangle symbol (♻️). If none, it likely goes to General Waste to avoid contamination.",
    benefit: "Correctly identifying material prevents recycling batch contamination.",
    burn: "Highly risky. Could contain hidden batteries or PVC.",
    landfill: "Contributes to the growing global waste crisis."
  },
  'mixed_composite': {
    material: "Mixed Materials Detected",
    category: "Composite / Mixed",
    binColor: "bg-amber-600",
    action: "Disassemble & Separate",
    instruction: "This item contains multiple materials (e.g., Wood + Metal). Please separate them before recycling.",
    benefit: "Separating materials ensures high-quality recycling. Mixed items are often rejected and landfilled.",
    burn: "Burning mixed composites releases unpredictable and often toxic fumes.",
    landfill: "Complex items take centuries to degrade. Metals leach toxins while plastics break into microparticles."
  }
};

function getWasteKey(label: string): string | null {
  if (['phone', 'computer', 'keyboard', 'laptop', 'notebook', 'tablet', 'ipad', 'mouse', 'screen', 'monitor', 'printer', 'remote', 'controller', 'radio', 'player', 'speaker', 'watch', 'clock', 'device', 'television', 'tv'].some(keyword => label.includes(keyword))) {
    return 'electronic';
  }
  if (['wire', 'cable', 'cord', 'coil', 'hard disc', 'hard drive', 'motherboard', 'circuit', 'chip', 'memory', 'modem', 'processor', 'cpu', 'battery'].some(keyword => label.includes(keyword)) || (label.includes('card') && label.includes('graphic'))) {
    return 'device_component';
  }
  if (['apple', 'banana', 'orange', 'lemon', 'fruit', 'vegetable', 'bread', 'mushroom', 'strawberry', 'food', 'corn', 'broccoli', 'pizza', 'burger', 'meat', 'chicken', 'salad', 'cake', 'ice cream', 'sandwich', 'soup', 'chocolate', 'cookie', 'dough', 'sushi', 'rice', 'noodle', 'pasta', 'cheese', 'egg', 'fish', 'steak', 'pie', 'tart', 'bun', 'toast', 'taco', 'burrito', 'hot dog', 'sausage', 'snack', 'meal', 'dinner', 'breakfast', 'bagel', 'pretzel', 'mashed', 'potato', 'carbonara', 'spaghetti', 'sauce', 'dip', 'guacamole', 'trifle', 'zucchini', 'squash', 'cucumber', 'pepper', 'onion', 'garlic'].some(keyword => label.includes(keyword))) {
    return 'food';
  }
  if (['bento', 'tiffin', 'tray', 'take-out', 'takeout', 'doggy bag', 'clamshell', 'lunch box'].some(keyword => label.includes(keyword)) || (label.includes('carton') && label.includes('food')) || (label.includes('box') && label.includes('food'))) {
    return 'food_container';
  }
  if (['water bottle', 'soda bottle', 'plastic bottle', 'pop bottle'].some(keyword => label.includes(keyword))) {
    return 'bottle';
  }
  if (['beer', 'soda', 'pop', 'beverage'].some(keyword => label.includes(keyword))) {
    return 'can';
  }
  if (['can', 'tin', 'opener', 'soup'].some(keyword => label.includes(keyword))) {
    return 'tin_can';
  }
  if (['mug', 'pottery', 'ceramic', 'clay', 'earthenware', 'porcelain', 'plate', 'saucer'].some(keyword => label.includes(keyword))) {
    return 'ceramic';
  }
  if (['spoon', 'fork', 'knife', 'spatula', 'ladle', 'cutlery'].some(keyword => label.includes(keyword))) {
    return 'metal_utensil';
  }
  if (['frying pan', 'wok', 'skillet', 'cauldron'].some(keyword => label.includes(keyword)) || (label.includes('pot') && !label.includes('flower'))) {
    return 'cookware';
  }
  if (['glass', 'jar', 'wine', 'beaker', 'goblet', 'pitcher'].some(keyword => label.includes(keyword))) {
    return 'glass';
  }
  if (['foam', 'styrofoam'].some(keyword => label.includes(keyword)) || (label.includes('cup') && label.includes('disposable'))) {
    return 'styrofoam';
  }
  if (['tupperware', 'container', 'storage', 'tub'].some(keyword => label.includes(keyword))) {
    return 'container';
  }
  if (['packet', 'wrapper'].some(keyword => label.includes(keyword)) || (label.includes('bag') && (label.includes('chip') || label.includes('snack') || label.includes('candy')))) {
    return 'snack';
  }
  if ((label.includes('cup') && !label.includes('measuring')) || ['yogurt', 'pudding', 'plastic cup'].some(keyword => label.includes(keyword))) {
    return 'plastic_cup';
  }
  if (['wood', 'stick', 'lumber', 'timber', 'board', 'log', 'pole'].some(keyword => label.includes(keyword))) {
    return 'wood';
  }
  if (['carton', 'milk', 'juice'].some(keyword => label.includes(keyword))) {
    return 'carton';
  }
  if (['paper', 'box', 'cardboard', 'tissue', 'envelope', 'book', 'notebook', 'toilet'].some(keyword => label.includes(keyword))) {
    return 'paper';
  }
  if (['shirt', 'jean', 'sock', 'jersey', 'shoe', 'cloth', 'towel', 'pillow', 'purse', 'wallet', 'backpack'].some(keyword => label.includes(keyword))) {
    return 'textile';
  }
  if (['bucket', 'basin', 'crate', 'toy', 'lego', 'pen', 'lighter', 'toothbrush', 'comb'].some(keyword => label.includes(keyword))) {
    return 'hard_plastic';
  }
  return null;
}

export default function UpcycleAIPage() {
  const [model, setModel] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<WasteData | null>(null);
  const [alerts, setAlerts] = useState({ decompose: false, hazard: false });
  const [modelLoaded, setModelLoaded] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const loadScripts = async () => {
      try {
        if (!window.tf) {
          const tfScript = document.createElement('script');
          tfScript.src = 'https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@latest/dist/tf.min.js';
          tfScript.async = true;
          document.body.appendChild(tfScript);
          await new Promise((resolve) => tfScript.onload = resolve);
        }

        if (!window.mobilenet) {
          const mobileNetScript = document.createElement('script');
          mobileNetScript.src = 'https://cdn.jsdelivr.net/npm/@tensorflow-models/mobilenet@latest/dist/mobilenet.min.js';
          mobileNetScript.async = true;
          document.body.appendChild(mobileNetScript);
          await new Promise((resolve) => mobileNetScript.onload = resolve);
        }

        if (window.mobilenet) {
          const loadedModel = await window.mobilenet.load();
          setModel(loadedModel);
          setModelLoaded(true);
          console.log("Model loaded successfully");
        }
      } catch (error) {
        console.error("Error loading scripts:", error);
      }
    };

    loadScripts();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const processFile = (file: File) => {
    if (isProcessing) return;
    if (!model) {
      alert("AI Model is still loading. Please wait a moment.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setPreview(e.target.result as string);
        setResult(null);
        setAlerts({ decompose: false, hazard: false });
        setTimeout(() => runAnalysis(), 100);
      }
    };
    reader.readAsDataURL(file);
  };

  const runAnalysis = async () => {
    setIsProcessing(true);
    const imgElement = document.getElementById('image-preview') as HTMLImageElement;
    
    if (imgElement && model) {
      try {
        const predictions: Prediction[] = await model.classify(imgElement);
        displayResults(predictions);
      } catch (error) {
        console.error("Inference failed:", error);
        alert("Something went wrong with the AI analysis.");
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const displayResults = (predictions: Prediction[]) => {
    const detectedKeys = new Set<string>();
    const top3 = predictions.slice(0, 3);
    
    console.log("Top 3 predictions:", top3);

    top3.forEach(p => {
      const key = getWasteKey(p.className.toLowerCase());
      if (key) detectedKeys.add(key);
    });

    const hasWood = detectedKeys.has('wood');
    const hasWire = detectedKeys.has('device_component') || detectedKeys.has('electronic');
    const hasMetal = detectedKeys.has('can') || detectedKeys.has('tin_can') || detectedKeys.has('metal_utensil');
    
    let finalData: WasteData;

    if (hasWood && (hasWire || hasMetal)) {
      finalData = wasteDatabase['mixed_composite'];
    } else if (detectedKeys.size > 0) {
      const primaryKey = Array.from(detectedKeys)[0];
      finalData = wasteDatabase[primaryKey];
    } else {
      finalData = wasteDatabase['manual_check'];
    }

    let showHazard = false;
    let showDecompose = false;

    if (finalData.category === 'Hazardous' || hasWire) {
      showHazard = true;
    } else if (finalData.category === 'Biodegradable') {
      showDecompose = true;
    }

    setResult(finalData);
    setAlerts({ decompose: showDecompose, hazard: showHazard });
  };

  return (
    <div className="min-h-screen text-white antialiased font-sans overflow-x-hidden relative">
      <div className="relative z-10 flex flex-col min-h-screen pb-24">
        <div className="max-w-4xl mx-auto px-4 py-6 w-full">
            <div className="flex justify-center mb-8">
                <div className={`
                    inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-bold uppercase tracking-wider shadow-lg backdrop-blur-md transition-colors
                    ${modelLoaded ? 'bg-green-500/20 border-green-500/50 text-green-300' : 'bg-yellow-500/20 border-yellow-500/50 text-yellow-200'}
                `}>
                    {modelLoaded ? <CheckCircle2 size={14} /> : <Loader2 size={14} className="animate-spin" />}
                    {modelLoaded ? 'AI Model Ready' : 'Loading Model...'}
                </div>
            </div>
            <div className="flex flex-col gap-8">
                <div className="w-full">
                    <div 
                        onClick={() => fileInputRef.current?.click()}
                        onDragOver={(e) => { e.preventDefault(); }}
                        onDrop={handleDrop}
                        className="glass-card rounded-4xl p-2 relative overflow-hidden group cursor-pointer border-2 border-dashed border-white/20 hover:border-green-400/50 transition-all min-h-87.5 flex flex-col items-center justify-center"
                    >
                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            className="hidden" 
                            accept="image/*" 
                            onChange={handleFileChange}
                        />
                        {!preview && (
                            <div className="text-center p-8 transition-transform duration-300 group-hover:scale-105">
                                <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl border border-white/10 text-white">
                                    <Camera size={36} />
                                </div>
                                <h3 className="font-display font-bold text-2xl text-white mb-2">Scan Item</h3>
                                <p className="text-gray-400 text-sm">Tap or drag & drop to analyze</p>
                            </div>
                        )}
                        {preview && (
                            <Image 
                                id="image-preview" 
                                src={preview} 
                                fill 
                                className="max-w-full max-h-100 object-contain rounded-2xl z-10" 
                                alt="Preview" 
                            />
                        )}
                        {isProcessing && (
                            <div className="absolute inset-0 z-20 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center">
                                <div className="absolute top-0 left-0 w-full h-1 bg-green-400 shadow-[0_0_20px_#4ade80] animate-[scan_2s_linear_infinite]" />
                                <div className="bg-black/50 px-6 py-3 rounded-full border border-white/10 backdrop-blur-xl flex items-center gap-3">
                                    <ScanLine size={18} className="text-green-400 animate-pulse" />
                                    <span className="text-white font-mono text-sm tracking-widest">ANALYZING...</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                <div className={`space-y-6 transition-all duration-700 ${!result && !isProcessing ? 'opacity-30 blur-sm pointer-events-none' : 'opacity-100'}`}>
                    <div className="grid gap-4">
                        {alerts.decompose && (
                            <div className="glass-card bg-lime-500/10 border-lime-500/30 p-6 rounded-3xl flex items-start gap-5">
                                <div className="bg-lime-500/20 p-3 rounded-2xl shrink-0">
                                    <Leaf className="w-8 h-8 text-lime-400" />
                                </div>
                                <div>
                                    <h4 className="text-lg font-bold text-white mb-1">Organic Waste Detected</h4>
                                    <p className="text-sm text-lime-100/80 leading-relaxed">
                                        This item is biodegradable. Composting it creates nutrient-rich soil instead of harmful methane gas in landfills.
                                    </p>
                                </div>
                            </div>
                        )}

                        {alerts.hazard && (
                            <div className="glass-card bg-red-500/10 border-red-500/30 p-6 rounded-3xl flex items-start gap-5">
                                <div className="bg-red-500/20 p-3 rounded-2xl shrink-0 animate-pulse">
                                    <AlertTriangle className="w-8 h-8 text-red-400" />
                                </div>
                                <div>
                                    <h4 className="text-lg font-bold text-white mb-1">Hazardous Material</h4>
                                    <p className="text-sm text-red-100/80 leading-relaxed">
                                        Do not place in general waste. Contains toxic components (e.g., batteries, heavy metals) that can poison water supplies.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="glass-card p-5 rounded-3xl border-l-4 border-l-blue-400">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-blue-300 block mb-1">Material</span>
                            <span className="text-lg font-bold text-white">{result ? result.material : '...'}</span>
                        </div>
                        <div className="glass-card p-5 rounded-3xl border-l-4 border-l-green-400">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-green-300 block mb-1">Category</span>
                            <span className="text-lg font-bold text-white">{result ? result.category : '...'}</span>
                        </div>
                    </div>
                    <div className={`glass-card rounded-4xl p-8 relative overflow-hidden transition-all duration-500 ${result ? 'border-green-500/30' : ''}`}>
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
                        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                            <div className={`
                                w-32 h-40 rounded-2xl flex flex-col items-center justify-center text-white shadow-2xl shrink-0 transform transition-transform hover:scale-105 border border-white/20
                                ${result ? result.binColor : 'bg-gray-700'}
                            `}>
                                <Recycle size={48} className="opacity-90 mb-2" />
                                <span className="text-[10px] font-bold uppercase tracking-widest bg-black/20 px-2 py-1 rounded">BIN</span>
                            </div>
                            <div className="text-center md:text-left flex-1">
                                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Recommended Action</h3>
                                <h2 className="text-3xl font-display font-bold text-white mb-3">
                                    {result ? result.action : 'Waiting for scan...'}
                                </h2>
                                <p className="text-gray-300 leading-relaxed text-sm md:text-base">
                                    {result ? result.instruction : 'Scan an item to see specific disposal instructions.'}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="glass-card p-6 rounded-3xl">
                            <div className="flex items-center gap-3 mb-3 text-emerald-400">
                                <Sprout size={20} />
                                <h4 className="font-bold text-sm uppercase tracking-wide">Positive Impact</h4>
                            </div>
                            <p className="text-sm text-gray-300 leading-relaxed">
                                {result ? result.benefit : '...'}
                            </p>
                        </div>
                        <div className="glass-card p-6 rounded-3xl bg-red-500/5 border-red-500/10">
                            <div className="flex items-center gap-3 mb-3 text-red-400">
                                <Flame size={20} />
                                <h4 className="font-bold text-sm uppercase tracking-wide">Consequences</h4>
                            </div>
                            <div className="space-y-3">
                                <div className="flex gap-3 items-start">
                                    <Flame size={14} className="mt-1 shrink-0 opacity-50" />
                                    <p className="text-xs text-gray-400">{result ? result.burn : '...'}</p>
                                </div>
                                <div className="flex gap-3 items-start">
                                    <Trash2 size={14} className="mt-1 shrink-0 opacity-50" />
                                    <p className="text-xs text-gray-400">{result ? result.landfill : '...'}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}