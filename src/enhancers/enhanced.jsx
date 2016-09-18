import compose from '../helpers/compose';
import committable from '../enhancers/committable';
import uncontrolled from '../enhancers/uncontrolled';
import withValueAtPath from '../enhancers/withValueAtPath';

/**
 * Applies a common set of enhancers used by all cspace-input components.
 */
export default compose(committable, uncontrolled, withValueAtPath);
