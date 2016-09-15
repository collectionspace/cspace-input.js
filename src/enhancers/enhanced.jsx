import compose from '../helpers/compose';
import changeable from '../enhancers/changeable';
import committable from '../enhancers/committable';
import named from '../enhancers/named';
import uncontrolled from '../enhancers/uncontrolled';

export default compose(committable, changeable, uncontrolled, named);
