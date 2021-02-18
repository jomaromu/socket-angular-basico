import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { WebsocketService } from './websocket.service';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(
    public wsServices: WebsocketService
  ) { }


  // enviar mensajes
  sendMessage(mensaje: string): void {

    const payload = {
      de: this.wsServices.getUsuario().nombre,
      cuerpo: mensaje
    };

    this.wsServices.emitir('mensaje', payload);
  }

  // recibir mensajes
  getMessages(): Observable<any> {
    return this.wsServices.listen('mensaje-nuevo');
  }


  // recibir menasjes privados
  getMessagesPrivate(): Observable<any> {
    return this.wsServices.listen( 'mensaje-privado' );
  }

  getUsuariosActivos(): Observable<any> {
    return this.wsServices.listen( 'usuarios-activos' );
  }

  emitirUsuariosActivos(): void {
    this.wsServices.emitir( 'obtener-usuarios');
  }
}
