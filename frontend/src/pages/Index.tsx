import { motion } from "framer-motion";
import { Factory, MapPin, Globe, TrendingUp, Users, Award, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const Index = () => {
  const sailPlants = {
    integrated: [
      { name: "Bhilai Steel Plant", location: "Chhattisgarh", capacity: "7.5 MT", products: ["Rails", "Plates", "HR Coils"] },
      { name: "Bokaro Steel Plant", location: "Jharkhand", capacity: "5.8 MT", products: ["HR Coils", "CR Sheets", "Plates"] },
      { name: "Rourkela Steel Plant", location: "Odisha", capacity: "4.5 MT", products: ["HR Coils", "Plates", "CR Sheets"] },
      { name: "Durgapur Steel Plant", location: "West Bengal", capacity: "2.2 MT", products: ["Rails", "Wheels", "Axles"] },
      { name: "IISCO Steel Plant", location: "West Bengal", capacity: "2.5 MT", products: ["Rails", "Pig Iron", "Billets"] }
    ],
    special: [
      { name: "Alloy Steels Plant", location: "West Bengal", products: ["Alloy Steel", "Forgings"] },
      { name: "Salem Steel Plant", location: "Tamil Nadu", products: ["Stainless Steel"] },
      { name: "Visvesvaraya Iron & Steel Plant", location: "Karnataka", products: ["Alloy Steel", "Forged Products"] }
    ],
    ferro: [
      { name: "Chandrapur Ferro Alloy Plant", location: "Maharashtra", products: ["Ferro Manganese", "Silico Manganese"] }
    ],
    subsidiary: [
      { name: "SAIL Refractory Company", location: "Jharkhand", products: ["Refractory Bricks", "Castables"] }
    ]
  };

  const exportMarkets = [
    { region: "Africa", products: ["Rails", "HR Coils"] },
    { region: "Bangladesh", products: ["Rails", "Plates"] },
    { region: "Sri Lanka", products: ["Rails", "HR Coils"] },
    { region: "Middle East", products: ["Rails", "Plates"] },
    { region: "Europe", products: ["HR Coils", "CR Sheets", "Stainless Steel"] },
    { region: "Southeast Asia", products: ["HR Coils", "Plates"] },
    { region: "Gulf Countries", products: ["HR Coils", "CR Sheets"] }
  ];

  return (
    <div className="space-y-8 animate-fade-in-up" style={{ position: 'relative', zIndex: 1 }}>
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <div className="flex items-center justify-center gap-3 mb-6">
          <Factory className="h-12 w-12 text-primary" />
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            SAIL
          </h1>
        </div>
        <h2 className="text-3xl font-bold">Steel Authority of India Limited</h2>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          India's largest government-owned steel producer, powering the nation's infrastructure and manufacturing sectors
        </p>
      </motion.div>

      {/* Key Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-6 bg-transparent backdrop-blur-sm border-border/50 text-center">
            <Factory className="h-8 w-8 mx-auto mb-3 text-primary" />
            <p className="text-3xl font-bold">21.4 MT</p>
            <p className="text-sm text-muted-foreground">Annual Production Capacity</p>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-6 bg-transparent backdrop-blur-sm border-border/50 text-center">
            <MapPin className="h-8 w-8 mx-auto mb-3 text-accent" />
            <p className="text-3xl font-bold">9</p>
            <p className="text-sm text-muted-foreground">Production Plants</p>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-6 bg-transparent backdrop-blur-sm border-border/50 text-center">
            <Globe className="h-8 w-8 mx-auto mb-3 text-green-500" />
            <p className="text-3xl font-bold">50+</p>
            <p className="text-sm text-muted-foreground">Export Countries</p>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-6 bg-transparent backdrop-blur-sm border-border/50 text-center">
            <Users className="h-8 w-8 mx-auto mb-3 text-blue-500" />
            <p className="text-3xl font-bold">65,000+</p>
            <p className="text-sm text-muted-foreground">Employees</p>
          </Card>
        </motion.div>
      </div>

      {/* Plant Categories */}
      <div className="space-y-8">
        {/* Integrated Steel Plants */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="p-6 bg-transparent backdrop-blur-sm border-border/50">
            <div className="flex items-center gap-3 mb-6">
              <Factory className="h-6 w-6 text-primary" />
              <h3 className="text-2xl font-bold">Integrated Steel Plants</h3>
              <Badge className="bg-primary/10 text-primary">5 Plants</Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sailPlants.integrated.map((plant, index) => (
                <motion.div
                  key={plant.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <h4 className="font-bold text-lg mb-2">{plant.name}</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    📍 {plant.location} • Capacity: {plant.capacity}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {plant.products.map((product) => (
                      <Badge key={product} variant="outline" className="text-xs">
                        {product}
                      </Badge>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Special Steel Plants */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card className="p-6 bg-transparent backdrop-blur-sm border-border/50">
            <div className="flex items-center gap-3 mb-6">
              <Award className="h-6 w-6 text-accent" />
              <h3 className="text-2xl font-bold">Special Steel Plants</h3>
              <Badge className="bg-accent/10 text-accent">3 Plants</Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sailPlants.special.map((plant, index) => (
                <motion.div
                  key={plant.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <h4 className="font-bold text-lg mb-2">{plant.name}</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    📍 {plant.location}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {plant.products.map((product) => (
                      <Badge key={product} variant="outline" className="text-xs">
                        {product}
                      </Badge>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Ferro Alloy & Subsidiary */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
            <Card className="p-6 bg-transparent backdrop-blur-sm border-border/50">
              <div className="flex items-center gap-3 mb-6">
                <TrendingUp className="h-6 w-6 text-green-500" />
                <h3 className="text-2xl font-bold">Ferro Alloy Plant</h3>
              </div>
              {sailPlants.ferro.map((plant, index) => (
                <motion.div
                  key={plant.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.0 + index * 0.1 }}
                  className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <h4 className="font-bold text-lg mb-2">{plant.name}</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    📍 {plant.location}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {plant.products.map((product) => (
                      <Badge key={product} variant="outline" className="text-xs">
                        {product}
                      </Badge>
                    ))}
                  </div>
                </motion.div>
              ))}
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
          >
            <Card className="p-6 bg-transparent backdrop-blur-sm border-border/50">
              <div className="flex items-center gap-3 mb-6">
                <Factory className="h-6 w-6 text-blue-500" />
                <h3 className="text-2xl font-bold">Subsidiary Company</h3>
              </div>
              {sailPlants.subsidiary.map((plant, index) => (
                <motion.div
                  key={plant.name}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.2 + index * 0.1 }}
                  className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <h4 className="font-bold text-lg mb-2">{plant.name}</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    📍 {plant.location}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {plant.products.map((product) => (
                      <Badge key={product} variant="outline" className="text-xs">
                        {product}
                      </Badge>
                    ))}
                  </div>
                </motion.div>
              ))}
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Export Markets */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.3 }}
      >
        <Card className="p-6 bg-transparent backdrop-blur-sm border-border/50">
          <div className="flex items-center gap-3 mb-6">
            <Globe className="h-6 w-6 text-green-500" />
            <h3 className="text-2xl font-bold">Global Export Markets</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {exportMarkets.map((market, index) => (
              <motion.div
                key={market.region}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.4 + index * 0.1 }}
                className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <h4 className="font-bold mb-2">{market.region}</h4>
                <div className="flex flex-wrap gap-1">
                  {market.products.map((product) => (
                    <Badge key={product} variant="outline" className="text-xs">
                      {product}
                    </Badge>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Call to Action */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5 }}
        className="text-center"
      >
        <Card className="p-8 bg-gradient-to-r from-primary/10 to-accent/10 border-border/50">
          <h3 className="text-2xl font-bold mb-4">Explore SAIL Operations</h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Discover how SAIL's integrated logistics and optimization systems ensure efficient steel production and distribution across India and global markets.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button className="gap-2">
              View Dashboard <ChevronRight className="h-4 w-4" />
            </Button>
            <Button variant="outline" className="gap-2">
              Production Overview <ChevronRight className="h-4 w-4" />
            </Button>
            <Button variant="outline" className="gap-2">
              Rake Allocation <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default Index;
