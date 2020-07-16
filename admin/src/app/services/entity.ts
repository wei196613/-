
export class CommonResp {
  status?: number;
  res: number | undefined;
  msg?: string;
  error?: any;
}

export enum AgentType {
  AGENT = 0, // 代理
  USER = 1 // 用户
}

export interface RolesList {
  total: number;
  arr: RolesItem[]
}

export interface RolesItem {
  id: number,
  name: string,
  permissions: [number],
  userCount: number
}

export interface AddRoleParams {
  name: string,
  permissions: [number]
}

export interface EditRoleParams extends AddRoleParams {
  id: number
}

export interface PermissionsItem {
  id: number,
  name: string,
}

export interface PermissionsList extends Common<PermissionsItem> { }



export interface GetAgentList {
  total: number;
  arr: GetAgentItem[]
}

export interface GetAgentItem {
  id: number,
  account: string,
  balance: number,
  total: number, //历史获得米币数
  today: number, //今日转出
  roleIds: number[],
  userAgent?: GetUserAgent,
  agentType?: number
}

export interface GetUserItem {
  id: number,
  account: string,
  balance: number,
  total: number, //历史消耗米币数
  today: number, //今日消耗
  roleIds: number[],
  userAgent?: GetUserAgent,
  agentType?: number;
  devices: PermissionsItem[]
}
export interface GetUserList extends Common<GetUserItem> {
}

export interface GetUserAgent {
  id: number,
  account: string
}

export interface CreateAgent {
  account: string,
  pwd: string
}

export interface ResetAgentPwd {
  account: string
}

export interface GetInvitationCodeListParams {
  perPage: number, // 每页
  curPage: number,
  account?: string,
  category?: number,//0 普通 1 限时免费
  isUsed?: Boolean,
  start?: string,
  end?: string
}

export interface GetInvitationCodeList {
  total: number,
  arr: [{
    id: number,
    code: string,
    agent: string,
    balance?: number,
    user?: string,
    roleGroupName: string,
    createTime: number,//代理获得时间
    useTime?: number,//用户使用时间
    deleteTime?: number //有表示已经作废
  }]
}

export interface TaskItem {
  id: number
  taskId: string
  account: string
  deviceName: string
  startTime: number,
  endTime?: number,
  status: string,
  product?: { step: string, id: string, price: number },
  payPrice?: { step: string, price: number }
}

export interface TaskList {
  total: number;
  arr: TaskItem[]
}

export interface TaskDetail {
  account: string,
  pwd: string,
  url: string,
  address: string,
  orderId?: string,
  coupons: string[]
}

export interface ActionTypeNameItem {
  id: number,
  name: string, // 任务名：中文
  key: string, // 任务键值：英文
  parasTotal: number;
  inputParasTotal: number,
  outputParasTotal: number,
  checked?: boolean;
}

export interface ActionTypeNames extends Common<ActionTypeNameItem> {

}

export interface GetActionById extends AddAction {
  id: number
}

export interface OutputParas {
  id: number,
  /**参数名*/
  name: string,
  /**参数键值*/
  key: string,
  /**参数类型*/
  tpe: number
}

export interface InputParas extends OutputParas {
  /** select类型才有 {key:string,value:string}*/
  values?: string,
  /**正则 （该参数的独立约束）*/
  constraint?: string,
  /**格式如注所说明，满足该参数值=value或a<=参数值<=b时，隐藏/显示其他的字段*/
  cascadeConstraint?: string,
  tip: string,
}

export interface AddAction {
  /**任务名：中文*/
  name: string,
  /**任务键值：英文*/
  key: string,
  /**输入参数*/
  inputParas: InputParas[];
  /**输出参数*/
  outputParas: OutputParas[];
}

/**  当前的第2个action要引用第1个action输出的account参数的值作为它jdAccount输入的值*/
export interface OutputRefs {
  refOrder: number,
  refOutputKey: string,
  inputKey: string,
}

/**action参数命名冲突重命名*/
export interface ParaAlias {
  key: string,
  alias: string,

}

export interface Paras {
  /**前端点击哪个action的参数得到的新输入参数，就用那个参数的actionConfId*/
  actionConfId: number,
  /**原action的key或重命名后的key(如有)*/
  key?: string,
  /*** 原action的key或重命名后的key(如有) */
  name?: string, //
  defaultValue?: string;
}

export interface Actions {
  id: number,
  order: number,
  name?: string,
  outputRefs?: string | OutputRefs[],
  paraAlias?: string | ParaAlias[]
}

export interface AddTaskType {
  name: string;
  actionRels: Actions[];
  paras: Paras[]
}

export interface EditTaskType extends AddTaskType {
  id: number;
}

export interface TaskTypeItem {
  id: number,
  name: string,
  actionRels: Actions[],
}

export interface TaskTypes extends Common<TaskTypeItem> {

}

/**组合任务所需*/
export interface ActionTagsItem {
  id: number;
  name: string;
  /**输入参数 Tag*/
  inputTags: Tags[],
  /**输出参数 Tag*/
  outputTags: Tags[],
}

export interface Tags {
  id?: number;
  /**点击顺序*/
  queue?: number;
  /**绑定action的id*/
  refOrder?: string,
  oldName?: string,
  oldKey?: string,
  newName?: string,
  newKey?: string,
  color?: string,
  tpe?: number,
  defaultValue?: string
  type?: 'inputTags' | 'outputTags';
  /**记录该参数出现action的位置数组*/
  actionIndex?: number[];
  /**保存该参数绑定的其他参数的位置*/
  bindTag?: [number,number][];
}

export class Common<T> {
  total: number;
  arr: T[];
}
