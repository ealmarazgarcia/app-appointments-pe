# API Appointment PE

## Descripción
Este proyecto es una API serverless para la gestión de citas médicas y horarios, diseñada para ejecutarse en AWS utilizando servicios como SQS, EventBridge y MySQL. El flujo principal consiste en procesar mensajes entrantes desde SQS, crear entidades de cita y horario, y publicar eventos de confirmación.

## Arquitectura
- **AWS Lambda**: Función principal que procesa mensajes de SQS.
- **MySQL**: Persistencia de entidades `Appointment` y `Schedules` usando TypeORM.
- **Serverless Framework**: Orquestación y despliegue de la infraestructura.

### Estructura de Carpetas
```
api-appointment-pe/
├── src/
│   ├── application/         # Lógica de negocio y casos de uso
│   ├── domain/              # Entidades y repositorios
│   ├── infrastructure/      # Integraciones AWS y persistencia
│   └── shared/di/           # Inyección de dependencias
├── serverless.yml           # Configuración Serverless Framework
├── package.json             # Dependencias y scripts
└── tsconfig.json            # Configuración TypeScript
```

## Entidades Principales
- **Appointment**: Representa una cita médica.
  - Campos: `appointmentId`, `insuredId`, `scheduleId`, `countryISO` (PE/CL), `status` (pending/completed)
- **Schedules**: Representa un horario disponible.
  - Campos: `scheduleId`, `centerId`, `specialtyId`, `medicId`, `date`

## Flujo de Procesamiento
1. **Recepción de Mensaje SQS**: El handler principal recibe un evento SQS.
2. **Procesamiento**: Se valida y procesa el mensaje, creando entidades de horario y cita si corresponde.
3. **Persistencia**: Se almacenan los datos en MySQL usando TypeORM.
4. **Publicación**: Se publica un evento de confirmación.

### Instalación
```bash
npm install
```

### Despliegue
Asegúrate de tener configuradas las credenciales de AWS y las variables de entorno necesarias.
```bash
npx serverless deploy
```

### Ejecución Local
Puedes usar el plugin `serverless-offline` para pruebas locales:
```bash
npx serverless offline
```

## Notas
- El proyecto utiliza inyección de dependencias para facilitar la escalabilidad y pruebas.
- La lógica de negocio está desacoplada de la infraestructura para mayor mantenibilidad.

## Autor
- Eduardo Almaraz García