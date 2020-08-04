import { AgentDetailsComponent } from './agent-details/agent-details.component';
import { AgentAddComponent } from './agent-add/agent-add.component';
import { AgentComponent } from './agent/agent.component';
import { ComponentsModule } from 'src/app/components/components.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AgentRoutingModule } from './agent-routing.module';
import { AgentDetailsMoalComponent } from './agent-details-moal/agent-details-moal.component';


@NgModule({
  declarations: [
    AgentComponent,
    AgentAddComponent,
    AgentDetailsComponent,
    AgentDetailsMoalComponent
  ],
  imports: [
    CommonModule,
    AgentRoutingModule,
    ComponentsModule
  ]
})
export class AgentModule { }
