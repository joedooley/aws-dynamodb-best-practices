### GSI Write Sharding

<br/>

https://www.dynamodbguide.com/leaderboard-write-sharding
https://amazon-dynamodb-labs.com/design-patterns/ex3gsisharding.html

The primary key of a DynamoDB table or a global secondary index consists of a partition key and an optional sort key. The way you design the content of those keys is extremely important for the structure and performance of your database. Partition key values determine the logical partitions in which your data is stored. Therefore, it is important to choose a partition key value that **uniformly distributes the workload across all partitions** in the table or global secondary index.

<br/>

> Global Secondary Index Write Sharding is an effective design pattern to query selectively the items spread across different logical partitions in a very large table.
> This pattern optimizes writes. Reads are slower, but the main point is to avoid hot partition.

---

<br/>

### Hot Partition

A hot partition is created when data is routed to the same node (too much data using same partition key). If we're doing a large amount of writes, our writes to the Leaderboard GSI could get throttled since all operations are pounding the same node.

#### Image Table

<br/>

> HASH: Image

| Image (Key)    | ViewCount | GSI Hash |
| -------------- | :-------: | :------: |
| images/001.jpg |    27     |  IMAGES  |
| images/002.jpg |    23     |  IMAGES  |
| images/003.jpg |    16     |  IMAGES  |
| images/004.jpg |    83     |  IMAGES  |
| images/005.jpg |    52     |  IMAGES  |
| images/006.jpg |    94     |  IMAGES  |

<br/>

#### Image Table - Leaderboard GSI

<br/>

> HASH: GSI Hash; RANGE: ViewCount  
> Leaderboard GSI restructures the data into a different format.
>
> The **main problem** with this GSI is that all items use the same parition key value of 'IMAGES'.
>
> If we're doing a large amount of reads/writes, our writes to the Leaderboard GSI could get throttled since all operations are pounding the same node.

<br/>

| GSI Hash (Key) | ViewCount |     Image      |
| -------------- | :-------: | :------------: |
| IMAGES         |    94     | images/006.jpg |
| IMAGES         |    83     | images/004.jpg |
| IMAGES         |    52     | images/005.jpg |
| IMAGES         |    27     | images/001.jpg |
| IMAGES         |    23     | images/002.jpg |
| IMAGES         |    16     | images/003.jpg |

---

<br/>

### Write Sharding

<br/>

> Technique: Rather than putting all images in the same Leaderboard GSI partition, we will arbitrarily split them across N number of partitions.

For example, imagine we want to split our Leaderboard GSI into three partitions. Upon creating an item, we will add an attribute called "Partition" and randomly assign the item to one of our three partitions -- "PARTITION_0", "PARTITION_1", or "PARTITION_2".

<br/>

#### Image Table

<br/>

> HASH: Image

| Image (Key)    | ViewCount |  Partition  |
| -------------- | :-------: | :---------: |
| images/001.jpg |    27     | PARTITION_1 |
| images/002.jpg |    23     | PARTITION_0 |
| images/003.jpg |    16     | PARTITION_0 |
| images/004.jpg |    83     | PARTITION_2 |
| images/005.jpg |    52     | PARTITION_1 |
| images/006.jpg |    94     | PARTITION_2 |

<br/>

#### Image Table - Leaderboard GSI

<br/>

> HASH: Partition; RANGE: ViewCount  
> Each Partition is separate and ViewCount is ordered separately by Partition

<br/>

| Partition   | ViewCount |     Image      |
| ----------- | :-------: | :------------: |
| PARTITION_0 |    23     | images/002.jpg |
| PARTITION_0 |    16     | images/003.jpg |
| PARTITION_1 |    52     | images/005.jpg |
| PARTITION_1 |    27     | images/001.jpg |
| PARTITION_2 |    94     | images/006.jpg |
| PARTITION_2 |    83     | images/004.jpg |

---

<br/>

### Scatter Gather

<br/>

> In the above sample, we sharded our leaderboard GSI across multiple partitions to alleviate hot partition issues

Imagine that we want to find the **top 3 images** by view count across our entire data set.
To do this, we need to do the following steps:

1. Query each of our partitions to find the top 3 images by view count within each partition
2. In our application code, **sort the results** by view count to obtain a consolidated view.
3. Return the top 3 results.
