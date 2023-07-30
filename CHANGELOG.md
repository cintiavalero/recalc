# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]
## [1.4.0] 21-06-2023
### Added
    -Operacion raiz.
    -Operacion decimal a binario.
    -Funcionalidad de modo oscuro y modo claro
    -Se agrega el historial de operaciones en la calculadora y un boton para borrarlo
    -Se agrego la funcionalidad para escribir desde el teclado
    -Se agregaron test e2e correspondientes a todo lo anterior. 
    -Se agregó un test e2e que comprueba si la multiplicación es entre dos números negativos da como resultado uno positivo
    -Se agregó un test para la funcionalidad para permitir números negativos.
### Fixed
    -Se resolvieron errores de undefined
    -Se arreglo la funcionalidad del boton "C"
    -Se implemento el uso de numeros negativos
    
## [1.3.3] 19-06-2023
### Added
    -Se realizaron las conexiones del front con la api.
    -Se agregaron test e2e.
    -Se le subio en nivel a las reglas del eslint.
### Fixed
    Se resolvieron errores detectados por test estatico

## [1.3.2] 08-06-2023

### Fixed

- Path donde corre eslint

### Fixed

- Problema al correr tests e2e en Windows

## [1.3.1] 05-06-2023

### Added

- Dependencia cross-env para correr tests e2e

### Fixed

- Problema al correr tests e2e en Windows

## [1.3.0] 05-06-2023

### Added

- Interfaz básica de la calculadora
- ESLint para tests estáticos
- Playwright para tests e2e

## [1.2.0] 15-05-2023

### Added

- Sequelize para el manejo de base de datos
- Tests de integración sobre API y modelo
- Integración continua

## [1.1.0] 20-04-2023

### Added

- Endpoint para la función de resta
- Dependencias para realizar tests
- Tests para la función de resta

## [1.0.0] 17-04-2023

### Added

- Interface CLI para realizar cálculos en forma interactiva
- Base de la API
- Funciones core para realizar suma, resta, multiplicación, división y potencia

[unreleased]: https://github.com/frlp-utn-ingsoft/recalc/compare/v1.3.2...HEAD
[1.3.2]: https://github.com/frlp-utn-ingsoft/recalc/releases/tag/v1.3.2
[1.3.1]: https://github.com/frlp-utn-ingsoft/recalc/releases/tag/v1.3.1
[1.3.0]: https://github.com/frlp-utn-ingsoft/recalc/releases/tag/v1.3.0
[1.2.0]: https://github.com/frlp-utn-ingsoft/recalc/releases/tag/v1.2.0
[1.1.0]: https://github.com/frlp-utn-ingsoft/recalc/releases/tag/v1.1.0
[1.0.0]: https://github.com/frlp-utn-ingsoft/recalc/releases/tag/v1.0.0
