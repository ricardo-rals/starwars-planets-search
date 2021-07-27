import React from 'react';
import './App.css';
import Table from './components/Table';
import OrderForm from './components/OderForm';
import PlanetsProvider from './services/MyProvider';

function App() {
  return (
    <PlanetsProvider>
      <OrderForm />
      <Table />
    </PlanetsProvider>
  );
}

export default App;
