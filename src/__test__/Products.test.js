import { render, screen,cleanup,fireEvent } from '@testing-library/react';
import React from 'react';
import '@testing-library/jest-dom/extend-expect' 
import Products from '../components/Products';


test('should render content', () => {
    render(<Products/>);
    const table= screen.getByTestId('tableH')
    expect(table).toBeInTheDocument()
    const addButton= screen.getByTestId('addB')
    expect(addButton).toBeInTheDocument()
});

test('Should show modal', () => {
    render(<Products/>);
    const addButton= screen.getByTestId('addB')
    expect(addButton).toBeInTheDocument()
    addButton.click();
    const modal= screen.getByTestId('modal')
    expect(modal).toHaveTextContent('Insertar')
    
});

test('Should have the fields', () => {
    render(<Products/>);
    const addButton= screen.getByTestId('addB')
    expect(addButton).toBeInTheDocument()
    addButton.click();
    const name= screen.getAllByTestId('nombreC')
    expect(name).not.toBeNull();
    const cost= screen.getAllByTestId('costo')
    expect(cost).not.toBeNull();
    const price= screen.getAllByTestId('precio')
    expect(price).not.toBeNull();
    const insertB= screen.getAllByTestId('insertarB')
    expect(insertB).not.toBeNull()
    
});

test('Should validate the fields', () => {
    render(<Products/>);
    const addButton= screen.getByTestId('addB')
    expect(addButton).toBeInTheDocument()
    addButton.click();
    const insertB= screen.getByTestId('insertarB')
    fireEvent.click(insertB);
    const modal= screen.getByTestId('modal')
    expect(modal).toHaveTextContent('Este campo es obligatorio');
});
