import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client/build/index';
import { environment } from 'src/environments/environment';

import { Usuario } from '../classes/usuario';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  public socketStatus = false;
  private socket: Socket;
  public usuario: Usuario = null;

  constructor(
    private router: Router
  ) {
    this.socket = io(environment.wsUrl);
    this.cargarStorage();
    this.checkStatus();
  }

  // verifica estado de la conexion
  checkStatus(): void {

    console.log('inicia checstatus');

    // escuchar el servidor
    this.socket.on('connect', () => {
      console.log('conectado al servidor');
      this.socketStatus = true;
      this.cargarStorage();
    });

    this.socket.on('disconnect', () => {
      console.log('Desconectado del servidor');
      this.socketStatus = false;
    });
  }

  // emitir eventos
  // tslint:disable-next-line: ban-types
  emitir(evento: string, payload?: any, callback?: Function): void {
    this.socket.emit(evento, payload, callback);
  }

  // escuchar eventos
  listen(evento: string): Observable<any> {

    return new Observable((subscriber) => {
      this.socket.on(evento, (callback: any) => {
        subscriber.next(callback);
      });
    });
  }

  loginWS(nombre: string): Promise<any> {

    return new Promise((resolve, reject) => {
      this.emitir('configurar-usuario', { nombre }, resp => {
        this.usuario = new Usuario(nombre);
        this.guardarStorage();
        resolve('ok');
      });
    });
  }

  logoutWS(): void {
    this.usuario = null;
    localStorage.removeItem('usuario');

    const payload = {
      nombre: 'sin-nombre'
    };

    this.emitir('configurar-usuario', payload, () => {} );
    this.router.navigateByUrl('');

  }

  getUsuario(): Usuario {
    return this.usuario;
  }

  guardarStorage(): void {
    localStorage.setItem('usuario', JSON.stringify(this.usuario));
  }

  cargarStorage(): void {

    if (localStorage.getItem('usuario')) {
      this.usuario = JSON.parse(localStorage.getItem('usuario'));
      this.loginWS(this.usuario.nombre);
    }
  }
}
