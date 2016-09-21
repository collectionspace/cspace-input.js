import compose from '../helpers/compose';
import committable from '../enhancers/committable';
import labelable from '../enhancers/labelable';
import repeatable from '../enhancers/repeatable';
import uncontrolled from '../enhancers/uncontrolled';
import withValueAtPath from '../enhancers/withValueAtPath';

/**
 * Applies a common set of enhancers used by all cspace-input components.
 */
export default compose(repeatable, labelable, withValueAtPath, committable, uncontrolled);
