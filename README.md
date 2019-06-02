## API overview

This is a restful API with the following endpoints

| Method | Url | Description |
| --- | --- | --- |
| POST | `/users/register` | Register/Sign-up a new user |
| POST | `/users/login` | Login for an existing user |
| GET | `/users/{user_id}/follow` | Follow a user |
| GET | `/users/{user_id}/unfollow` | Unfollow a user |
| GET | `/users/me` | Get current user info |
| POST | `/tweets/new` | Create a new tweet |
| GET | `/tweets/{tweet_id}/` | Get a tweet with ID |
| GET | `/tweets/{tweet_id}/like` | Like a tweet |
| GET | `/tweets/{tweet_id}/unlike` | Unlike a tweet |
| GET | `/tweets/{tweet_id}/retweet` | Retweet a tweet |
| POST | `/tweets/{tweet_id}/reply` | Reply to a tweet |
| GET | `/tweets/{tweet_id}/replies` | Get all replies to a tweet |
| GET | `/tweets/{tweet_id}/retweets` | Get all retweets of a tweet |


### Response Structure

```$xslt
{
    success: true/false,
    message: "...",
    data: [{...}, {...}],
    timestamp: <current_timestamp>
}
```

The above API response structure is followed for each endpoint listed above. 
On some endpoints, the `data` will be an empty array and sometimes the `message` will be an empty string.
The `success` field will reflect whether the requested operation was performed.

### Required fields

- `username` and `password`

    These two fields are required while registering a new user and while logging in.
    
- `content`

    This field is required when creating a new tweet and while replying to a tweet.
    