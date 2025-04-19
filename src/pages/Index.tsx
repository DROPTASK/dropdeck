
import React from 'react';
import { Home, Plus, Search, BarChart2, MenuIcon } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const Index = () => {
  return (
    <div className="app-container">
      {/* Header */}
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <Button variant="outline" size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Add Project
        </Button>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground">Total Value</p>
              <h3 className="text-2xl font-mono font-bold mt-1">$24,500</h3>
              <span className="text-green-500 text-sm">+12.5%</span>
            </div>
            <div className="bg-primary/20 p-2 rounded-full">
              <BarChart2 className="text-primary w-6 h-6" />
            </div>
          </div>
        </Card>
        {/* Add more stat cards here */}
      </div>

      {/* Bottom Navigation */}
      <nav className="bottom-nav">
        <a className="nav-item active">
          <Home size={20} />
          <span>Home</span>
        </a>
        <a className="nav-item">
          <Search size={20} />
          <span>Explore</span>
        </a>
        <a className="nav-item">
          <BarChart2 size={20} />
          <span>Stats</span>
        </a>
        <a className="nav-item">
          <MenuIcon size={20} />
          <span>Menu</span>
        </a>
      </nav>
    </div>
  );
};

export default Index;
