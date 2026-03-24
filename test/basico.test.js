// test/basico.test.js

test("Mi primera prueba: 2 mas 2 debe ser exactamente 4", () => {
  // Preparacion y ejecucion
  const resultado = 2 + 2;

  // Afirmacion (Lo que esperamos que pase)
  expect(resultado).toBe(4);
});
