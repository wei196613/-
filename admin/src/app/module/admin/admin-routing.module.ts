
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './main.component';

const routes: Routes = [
  {
    path: '', component: MainComponent,
    children: [
      { path: 'agent', loadChildren: () => import('./agent/agent.module').then(mod => mod.AgentModule) },
      { path: 'verification', loadChildren: () => import('./verification/verification.module').then(mod => mod.VerificationModule) },
      { path: 'role', loadChildren: () => import('./role/role.module').then(mod => mod.RoleModule) },
      { path: 'device', loadChildren: () => import('./device-man/device-man.module').then(mod => mod.DeviceManModule) },
      { path: 'custom-action', loadChildren: () => import('./custom-action/custom-action.module').then(mod => mod.CustomActionModule) },
      { path: 'task-type', loadChildren: () => import('./task-type/task-type.module').then(mod => mod.TaskTypeModule) },
      { path: 'task-record', loadChildren: () => import('./task-recor/task-recor.module').then(mod => mod.TaskRecorModule) },
      { path: 'cloud-entrance', loadChildren: () => import('./cloud-entrance/cloud-entrance.module').then(mod => mod.CloudEntranceModule) },
      { path: 'device-activation', loadChildren: () => import('./device-activation/device-activation.module').then(mod => mod.DeviceActivationModule) },
      { path: '**', redirectTo: 'agent', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
