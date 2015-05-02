import sys, getopt, json, copy, redis
import plotly.plotly as py
from plotly.graph_objs import *

def graph(key_val_tuples):
    # Unpack tuples array into two arrays - keys and counts
    keys, counts = tuple(list(tup) for tup in zip(*key_val_tuples))

    data = Data([
        Bar(
            x=keys,
            y=counts
        )
    ])
    plot_url = py.plot(data, filename='language-keyword-usage')
    print plot_url

def main(argv):
    try:
        opts, args = getopt.getopt(argv, '')
    except getopt.GetoptError:
        print 'graph.py <prefix>'
        sys.exit()
    key_val_tuples = get_tuples(args[0])
    graph(key_val_tuples)


def get_tuples(prefix):
    redis_client = redis.StrictRedis(host='localhost', port=6379, db=0)
    keys = redis_client.keys(prefix + "*")
    key_val_tuples = []
    for key in keys:
        orig_key = key
        key = key.replace(prefix, "", 1)
        key_val_tuples.append( ( key, int(redis_client.get(orig_key)) ) )

    return sorted(key_val_tuples, key=lambda kvtuple: kvtuple[1], reverse=True)

if __name__ == '__main__':
    main(sys.argv[1:])
