import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import CreatePaymentScreen from "../app/screens/payment/Createpayment";

describe('CreatePaymentScreen', () => {
  it('should create a payment with valid data', async () => {
    // Renderizar el componente
    const { getByText, getByPlaceholderText } = render(<CreatePaymentScreen navigation= />);

    // Simular interacción del usuario: Ingresar datos
    fireEvent.changeText(getByPlaceholderText('Título: '), 'Pago de prueba');
    fireEvent.changeText(getByPlaceholderText('Total: '), '50');

    // Simular interacción del usuario: Seleccionar usuario
    const userSelect = getByPlaceholderText('Seleccionar');
    fireEvent.press(userSelect);
    const selectedUserOption = getByText('Usuario de ejemplo'); // Cambia esto al valor real que debería aparecer
    fireEvent.press(selectedUserOption);

    // Simular interacción del usuario: Ingresar cantidades de participantes
    const participantInput = getByPlaceholderText('Ingresar cantidad');
    fireEvent.changeText(participantInput, '20');

    // Simular interacción del usuario: Crear pago
    const createPaymentButton = getByText('Crear Pago');
    fireEvent.press(createPaymentButton);

    // Esperar a que el proceso de creación termine
    await waitFor(() => {
      expect(/* verifica aquí que el pago se haya creado correctamente */).toBeTruthy();
    });
  });
});
