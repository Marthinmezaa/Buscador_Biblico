// tests/busquedaController.test.js

const busquedaController = require("../src/controllers/busquedaController");
const validateEmotionInput = busquedaController.validateEmotionInput;

describe("Escudo de Validacion: validateEmotionInput", () => {
  test("1. Camino Feliz: Debe aceptar palabras correctas", () => {
    const resultado1 = validateEmotionInput("paz");
    expect(resultado1.isValid).toBe(true);
    expect(resultado1.error).toBeNull();

    const resultado2 = validateEmotionInput("Amor/Afecto");
    expect(resultado2.isValid).toBe(true);

    const resultado3 = validateEmotionInput("alegría");
    expect(resultado3.isValid).toBe(true);
  });

  test("2. Defensa 1: Debe rechazar entradas vacias o puros espacios", () => {
    const resultadoVacio = validateEmotionInput("");
    expect(resultadoVacio.isValid).toBe(false);
    expect(resultadoVacio.error).toBe("La emoción no puede estar vacía"); // <-- Tilde agregada

    const resultadoEspacios = validateEmotionInput("    ");
    expect(resultadoEspacios.isValid).toBe(false);
  });

  test("3. Defensa 2: Debe rechazar caracteres no permitidos", () => {
    const resultadoNumeros = validateEmotionInput("tristeza123");
    expect(resultadoNumeros.isValid).toBe(false);
    expect(resultadoNumeros.error).toBe(
      "La emoción contiene caracteres no permitidos",
    ); // <-- Tilde agregada

    const resultadoHacker = validateEmotionInput(
      "<script>alert('xss')</script>",
    );
    expect(resultadoHacker.isValid).toBe(false);
  });

  test("4. Defensa 3: Debe rechazar palabras exageradamente largas", () => {
    const palabraGigante = "a".repeat(101);
    const resultadoLargo = validateEmotionInput(palabraGigante);

    expect(resultadoLargo.isValid).toBe(false);
    expect(resultadoLargo.error).toBe(
      "La emoción es demasiado larga (máximo 100 caracteres)",
    ); // <-- Tildes agregadas
  });
});
