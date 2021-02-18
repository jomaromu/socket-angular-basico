import { Component, OnInit } from '@angular/core';
import { ChatService } from './services/chat.service';
import { WebsocketService } from './services/websocket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'basico';

  constructor(
    public wsService: WebsocketService,
    public chatServie: ChatService
  ) { }

  ngOnInit(): void {

    this.chatServie.getMessagesPrivate().subscribe(msg => {

      console.log(msg);

    });
  }
}
