import { StateService } from 'angular-ui-router';


export class StatefulComponent{
  protected $state: StateService;
  constructor(){

  }
  changeState(state: string){
    if (!this.$state){
      throw new Error('$state is not injected');
    }
    this.$state.go(state);
  }
}
