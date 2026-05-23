const { crearUsuario, prisma } = require('./userService');

// Mockear el método create del ORM
jest.spyOn(prisma.user, 'create');

describe('Suite de Pruebas de BD (Mocking ORM) - crearUsuario()', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('debe registrar el usuario llamando al ORM exactamente una vez con los argumentos correctos', async () => {
    const mockUserResponse = {
      id: 1,
      email: 'investigador@portal.com',
      nombre: 'Manuel Espinoza',
    };
    
    prisma.user.create.mockResolvedValue(mockUserResponse);

    const resultado = await crearUsuario('investigador@portal.com', 'securePwd123', 'Manuel Espinoza');

    expect(resultado).toEqual(mockUserResponse);
    expect(prisma.user.create).toHaveBeenCalledTimes(1);
    expect(prisma.user.create).toHaveBeenCalledWith({
      data: {
        email: 'investigador@portal.com',
        password: 'securePwd123',
        nombre: 'Manuel Espinoza'
      }
    });
  });

  test('no debe interactuar con la base de datos si faltan parámetros obligatorios', async () => {
    await expect(crearUsuario('', 'pwd123', 'Manuel')).rejects.toThrow(
      "El correo y contraseña son campos obligatorios"
    );

    expect(prisma.user.create).not.toHaveBeenCalled();
  });
});
