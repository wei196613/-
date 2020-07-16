import { AgentType } from 'src/app/services/entity';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'agentType'
})
export class AgentTypePipe implements PipeTransform {

  transform(value: 0 | 1): any {
    switch (value) {
      case AgentType.AGENT:
        return '代理';
      case AgentType.USER:
        return '用户';
    }

  }

}
