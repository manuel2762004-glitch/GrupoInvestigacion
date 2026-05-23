// En un entorno real este módulo importaría un cliente ORM real
const prisma = {
  user: {
    create: async () => {}, // Se mockeará en las pruebas
  }
};

async function crearUsuario(email, password, nombre) {
  if (!email || !password) {
    throw new Error("El correo y contraseña son campos obligatorios");
  }
  
  return await prisma.user.create({
    data: {
      email,
      password,
      nombre
    }
  });
}

module.exports = { crearUsuario, prisma };
