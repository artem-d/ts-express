import * as express from 'express';
import PostNotFoundException from '../exceptions/PostNotFoundException';
import IController from '../interfaces/controller.interface';
import IRequestWithUser from '../interfaces/requestWithUser.interface';
import authMiddleware from '../middleware/auth.middleware';
import validationMiddleware from '../middleware/validation.middleware';
import CreatePostDto from './post.dto';
import IPost from './post.interface';
import postModel from './posts.model';

class PostsController implements IController {
  public path = '/posts';
  public router = express.Router();
  private post = postModel;

  constructor() {
    this.initRoutes();
  }

  private initRoutes() {
    this.router.get(this.path, this.getAllPosts);
    this.router.get(`${this.path}/:id`, this.getPostById);
    this.router
      .all(`${this.path}/*`, authMiddleware)
      .patch(`${this.path}/:id`, validationMiddleware(CreatePostDto, true), this.modifyPost)
      .delete(`${this.path}/:id`, this.deletePost)
      .post(this.path, authMiddleware, validationMiddleware(CreatePostDto), this.createPost);
  }

  private getAllPosts = async (req: express.Request, res: express.Response) => {
    const posts = await this.post.find()
      .populate('author', '-password');
    res.send(posts);
  }

  private getPostById = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const id = req.params.id;
    this.post.findById(id)
      .then((post) => {
        if (post) {
          res.send(post);
        } else {
          next(new PostNotFoundException(id));
        }
      });
  }

  private modifyPost = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const id = req.params.id;
    const postData: IPost = req.body;
    this.post.findByIdAndUpdate(id, postData, { new: true })
      .then((post) => {
        if (post) {
          res.send(post);
        } else {
          next(new PostNotFoundException(id));
        }
      });
  }

  private createPost = async (req: IRequestWithUser, res: express.Response) => {
    const postData: IPost = req.body;
    const createdPost = new this.post({
      ...postData,
      author: req.user._id,
    });
    const post = await createdPost.save();
    await post.populate('author', '-password').execPopulate();
    res.send(post);
  }

  private deletePost = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const id = req.params.id;
    this.post.findByIdAndDelete(id)
      .then((successResponse) => {
        if (successResponse) {
          res.send(200);
        } else {
          next(new PostNotFoundException(id));
        }
      });
  }
}

export default PostsController;
