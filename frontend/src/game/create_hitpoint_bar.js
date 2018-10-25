import GameObject from './game_object';
import Transform from './transform';
import TransformSyncronizer from './transform_syncronizer';
import Syncronizer from './syncronizer';
import CircleRenderer from './renderers/circle_renderer';
import HitpointRenderer from './renderers/hitpoint_renderer';
import Vector from '../vector'; 
import Input from './input';
import Movement from './movement';
import Camera from './camera'; 
import Shoot from './shoot';
import Hitpoint from './hitpoint';
import Circle from './circle';


const createHitpointBar = ({ id, owned, position }) => {
  const player = new GameObject(id, 4);
  const transform = new Transform(Vector.fromPOJO(position));
  player.addComponent(transform);
  new TransformSyncronizer(id + '0', transform, owned);
  const hitpoint = new Hitpoint(100);
  player.addComponent(hitpoint);
  new Syncronizer(id+'1', hitpoint);
  player.addComponent(new CircleRenderer(radius, '#fce5cd'));
  
  player.addComponent(new Movement());
  player.addComponent(new Collider(new Circle(radius)));

  if (owned) {
    player.addComponent(new Input());
    player.addComponent(new Shoot()); 
    player.addComponent(new Camera());
  }
  return player;
};

export default createHitpointBar;