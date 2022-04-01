export class Estadisticas {
  constructor({ atq, def, vida }){
      this.atq = atq
      this.def = def
      this.vida = vida
      this.vidaInicial = vida
      this.atqInicial = atq
      this.defInicial = def
  }

  reducirVida(cantidad){
      this.vida -= cantidad
  }

  aumentarVida(cantidad){
      this.vida += cantidad
  }

  reducirDefensa(cantidad){
      this.def -= cantidad
  }

  aumentarDefensa(cantidad){
      this.def += cantidad
  }

  reducirAtaque(cantidad){
      this.atq -= cantidad
  }

  aumentarAtaque(cantidad){
      this.atq += cantidad
  }

  reducirAtaqueInicial(cantidad){
      this.atqInicial -= cantidad
  }

  aumentarAtaqueInicial(cantidad){
      this.atqInicial += cantidad
  }

  reducirDefensaInicial(cantidad){
      this.defInicial -= cantidad
  }

  aumentarDefensaInicial(cantidad){
      this.defInicial += cantidad
  }

  reducirVidaInicial(cantidad){
      this.vidaInicial -= cantidad
  }

  aumentarVidaInicial(cantidad){
      this.vidaInicial += cantidad
  }

  obtener(campo){
      return this.hasOwnProperty(campo) ? this[campo] : 0
  }

  obtenerInicial(campo){
      return this.hasOwnProperty(`${campo}Inicial`) ? this[`${campo}Inicial`] : 0
  }

  resetear(){
      this.atq = this.atqInicial
      this.def = this.defInicial
      this.vida = this.vidaInicial
  }
}